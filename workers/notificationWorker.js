import { Worker } from "bullmq";
import { redisConnection } from "../redis.js";

const worker = new Worker(
  "notificationQueue",
  async (job) => {
    if (!job.data.userId || !job.data.message) {
      console.log(`Notification job ${job.id} invalid: missing userId or message`);
      return;
    }
    console.log("Processing notification job:", job.id, job.data);
    await new Promise((r) => setTimeout(r, 3000));
    console.log(`Notification sent to user ${job.data.userId}`);
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log(`Notification job ${job.id} completed`);
});
worker.on("failed", (job, err) => {
  console.error(`Notification job ${job.id} failed:`, err);
});
