import { Queue } from "bullmq";
import { redisConnection } from "../redis.js";

export const notificationQueue = new Queue("notificationQueue", {
  connection: redisConnection,
});
