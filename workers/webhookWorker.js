import { Worker } from "bullmq";
import { redisConnection } from "../redis.js";

const worker = new Worker(
  "webhookQueue",
  async (job) => {
    if (!job.data.event || !job.data.payload) {
      console.log(`Webhook job ${job.id} invalid: missing event or payload`);
      return;
    }
    console.log("Processing webhook job:", job.id, job.data);
    await new Promise((r) => setTimeout(r, 2000));
    console.log(`Webhook triggered for event ${job.data.event}`);
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log(`Webhook job ${job.id} completed`);
});
worker.on("failed", (job, err) => {
  console.error(`Webhook job ${job.id} failed:`, err);
});