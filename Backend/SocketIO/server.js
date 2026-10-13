import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "https://ttalkie.netlify.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, or specific origin
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"], // Skip HTTP polling negotiation
});

export const getReceiverSocketId = (receiverId) => users[receiverId];

const users = {};

// Helper to parse cookies from handshake headers
const parseCookies = (cookieHeader) => {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0]?.trim();
    if (!name) return;
    const value = parts.slice(1).join("=").trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
};

// Authenticate socket connections
io.use((socket, next) => {
  try {
    const rawCookies = socket.handshake.headers?.cookie;
    const cookies = parseCookies(rawCookies);
    const token = cookies.jwt || socket.handshake.auth?.token;
    const queryUserId = socket.handshake.query?.userId;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded?.userId && mongoose.Types.ObjectId.isValid(decoded.userId)) {
          socket.userId = decoded.userId.toString();
          return next();
        }
      } catch (_) {
        // Token verification failed, fall through to query validation
      }
    }

    if (queryUserId && mongoose.Types.ObjectId.isValid(queryUserId)) {
      socket.userId = queryUserId.toString();
      return next();
    }

    return next(new Error("Authentication failed: Invalid credentials"));
  } catch (error) {
    return next(new Error("Internal Socket Authentication error"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.userId;
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    users[userId] = socket.id;
    io.emit("getonline", Object.keys(users));
  }

  // Relay typing indicator
  socket.on("typing", (data) => {
    if (data?.to && mongoose.Types.ObjectId.isValid(data.to)) {
      const receiverSocketId = getReceiverSocketId(data.to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { from: userId });
      }
    }
  });

  socket.on("stopTyping", (data) => {
    if (data?.to && mongoose.Types.ObjectId.isValid(data.to)) {
      const receiverSocketId = getReceiverSocketId(data.to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { from: userId });
      }
    }
  });

  socket.on("disconnect", () => {
    if (userId) {
      delete users[userId];
      io.emit("getonline", Object.keys(users));
    }
  });
});

export { app, io, server };