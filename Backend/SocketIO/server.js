import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://ttalkie.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"], // Skip HTTP polling negotiation
});

export const getReceiverSocketId = (receiverId) => users[receiverId];

const users = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    io.emit("getonline", Object.keys(users));
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete users[userId];
      io.emit("getonline", Object.keys(users));
    }
  });
});

export { app, io, server };