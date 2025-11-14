import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const redisConnection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

redisConnection.on("error", 
  (err) => console.log("❌ Redis Client Error:", err));
redisConnection.on("connect", 
  () => console.log("✅ Connected to Redis Cloud"));
