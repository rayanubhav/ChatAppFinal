import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"; // 1. Keep this import
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";
import path from 'path';

dotenv.config();

app.use(express.json());
app.use(cookieParser());

// 2. Use specific CORS settings here
app.use(cors({
    origin: "https://ttalkie.netlify.app",
    methods: ["GET", "POST"],
    credentials: true // This is crucial for cookies
}));

const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_URI;

try {
  await mongoose.connect(URI);
  console.log("MONGODB Connected");
} catch (error) {
  console.log(error);
}

app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

//Code for deployment
if (process.env.NODE_ENV === 'production') {
    const dirPath = path.resolve();

    // 3. Removed the conflicting 'client/build' line.
    // This now correctly points to your Vite build output.
    app.use(express.static(path.join(dirPath, 'Frontend', 'dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(dirPath, 'Frontend', 'dist', 'index.html'))
    })
}

server.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}`);
});