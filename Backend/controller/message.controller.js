import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../SocketIO/server.js";
import { getCache, setCache, deleteCache } from "../config/redis.js";

const getConversationCacheKey = (id1, id2) => {
  return `messages:${[id1.toString(), id2.toString()].sort().join(":")}`;
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "Message content cannot be empty" });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver ID" });
    }

    // Sanitize message text to prevent XSS
    const sanitizedContent = sanitizeHtml(message.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });

    if (!sanitizedContent) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Parallelize message creation and conversation thread upsert
    const [newMessage] = await Promise.all([
      Message.create({
        senderId,
        receiverId,
        message: sanitizedContent,
      }),
      Conversation.updateOne(
        { participants: { $all: [senderId, receiverId] } },
        { $setOnInsert: { participants: [senderId, receiverId] } },
        { upsert: true }
      ).catch(() => {}),
    ]);

    // Dispatch WebSocket notification immediately
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Invalidate Redis cache asynchronously in background (does not block HTTP response)
    const cacheKey = getConversationCacheKey(senderId, receiverId);
    deleteCache(cacheKey).catch(() => {});

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const senderId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(chatUser)) {
      return res.status(400).json({ message: "Invalid chat user ID" });
    }

    const cacheKey = getConversationCacheKey(senderId, chatUser);
    const cachedMessages = await getCache(cacheKey);
    if (cachedMessages) {
      return res.status(200).json(cachedMessages);
    }

    // Direct indexed query replacing expensive populate()
    const messages = await Message.find({
      $or: [
        { senderId, receiverId: chatUser },
        { senderId: chatUser, receiverId: senderId },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(50)
      .lean();

    // Cache in Redis asynchronously without blocking client response
    setCache(cacheKey, messages, 30).catch(() => {});

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};