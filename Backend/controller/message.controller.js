import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../SocketIO/server.js";

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

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: message.trim(),
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

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

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};