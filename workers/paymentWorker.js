import { Worker } from "bullmq";
import { redisConnection } from "../redis.js";

const worker = new Worker(
    "paymentQueue",
    async (job) => {
     if (!job.data.userId || !job.data.amount) {
         console.log(`Job ${job.id} invalid: missing userId or amount`);
        return;   
        };
        console.log("Processing payment job:", job.id, job.data);
        await new Promise((r) => setTimeout(r, 7000));
        console.log(`Payment processed for user ${job.data.userId}`); 
    },
    { connection: redisConnection }
);

worker.on("completed", (job) => console.log(`Payment job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`Payment job ${job.id} failed:`, err));