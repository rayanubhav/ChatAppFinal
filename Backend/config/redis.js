import dotenv from "dotenv";
dotenv.config();

import { createClient } from "redis";

let redisClient = null;
let isRedisConnected = false;

const redisUrl = process.env.REDIS_URL?.trim();

if (redisUrl) {
  try {
    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 15000,
        reconnectStrategy: (retries) => {
          if (retries > 12) {
            console.warn("Redis/Valkey: max reconnect attempts reached, using direct DB");
            return false;
          }
          // Give sleeping / cold-starting instances up to 10-15s to wake up
          return Math.min(retries * 1000, 3000);
        },
      },
    });

    redisClient.on("connect", () => {
      console.log("Redis/Valkey connected successfully");
      isRedisConnected = true;
    });

    redisClient.on("ready", () => {
      console.log("Redis/Valkey ready to serve requests");
      isRedisConnected = true;
    });

    redisClient.on("error", (err) => {
      console.warn("Redis/Valkey notice (using direct DB while connecting):", err.message);
      isRedisConnected = false;
    });

    redisClient.on("end", () => {
      isRedisConnected = false;
    });

    redisClient.connect().catch((err) => {
      console.warn("Redis/Valkey initial connection notice (waking up or waiting):", err.message);
      isRedisConnected = false;
    });
  } catch (error) {
    console.warn("Redis initialization failed:", error.message);
  }
} else {
  console.log("No REDIS_URL configured; running with direct database queries");
}

export const getCache = async (key) => {
  if (!redisClient || !isRedisConnected) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn(`Redis getCache error for key ${key}:`, err.message);
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 60) => {
  if (!redisClient || !isRedisConnected) return;
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (err) {
    console.warn(`Redis setCache error for key ${key}:`, err.message);
  }
};

export const deleteCache = async (key) => {
  if (!redisClient || !isRedisConnected) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    console.warn(`Redis deleteCache error for key ${key}:`, err.message);
  }
};

export default redisClient;
