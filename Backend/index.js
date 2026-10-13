import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import path from "path";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";

// Trust reverse proxy (e.g. Render, Railway, Heroku)
app.set("trust proxy", 1);

// HTTP Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Compression
app.use(compression());

// HTTP Request Logging
app.use(process.env.NODE_ENV === "production" ? morgan("combined") : morgan("dev"));

// Body parsing with 10kb size limit to prevent payload attacks
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Rate Limiting on Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts, please try again in 15 minutes" },
});

// General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

const allowedOrigins = [
  "https://ttalkie.netlify.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    maxAge: 86400, // Cache preflight OPTIONS responses for 24 hours (eliminates duplicate roundtrips)
  })
);

const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_URI;

// MongoDB Connection with Pooling and Reconnect Handling
try {
  await mongoose.connect(URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log("MONGODB Connected");
} catch (error) {
  console.error("Critical: MongoDB initial connection error:", error);
  process.exit(1);
}

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB connection lost!");
});

// Apply rate limits
app.use("/api/user/login", authLimiter);
app.use("/api/user/signup", authLimiter);
app.use("/api", apiLimiter);

import redisClient from "./config/redis.js";

// Health check endpoint (for free cron-job services to keep backend & Redis awake)
app.get("/api/health", async (req, res) => {
  let redisStatus = "not_configured";
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.ping();
      redisStatus = "connected";
    } else if (process.env.REDIS_URL) {
      redisStatus = "connecting_or_sleeping";
    }
  } catch (_) {
    redisStatus = "error";
  }

  res.status(200).json({
    status: "healthy",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    redis: redisStatus,
    database: mongoose.connection.readyState === 1 ? "connected" : "connecting",
  });
});

// Routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// Code for deployment
if (process.env.NODE_ENV === "production") {
  const dirPath = path.resolve();
  app.use(express.static(path.join(dirPath, "Frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(dirPath, "Frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});