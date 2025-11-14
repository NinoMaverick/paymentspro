import { Queue } from "bullmq";
import { redisConnection } from "../redis.js";

export const webhookQueue = new Queue("webhookQueue", {
  connection: redisConnection,
});
