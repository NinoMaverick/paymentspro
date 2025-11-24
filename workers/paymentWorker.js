import { Worker } from "bullmq";
import { redisConnection } from "../redis.js";
import prisma from "../lib/prisma.js";
import { webhookQueue } from "../queues/webhookQueue.js";
import { simulatePayment } from "../jobs/paymentProcessor.js";

const worker = new Worker(
    "paymentQueue",
    async (job) => {
    const { userId, amount, paymentId } = job.data;
     
    if (!userId || !amount || !paymentId ) {
         console.log(`Job ${job.id} invalid: missing userId, amount or paymentId`);
        return;   
        };

    console.log("Processing payment job:", job.id, job.data);
    
    const status = await simulatePayment({ userId, amount, paymentId });

    await prisma.payment.update({
        where: { id: paymentId },
        data: { status },
    });

    console.log(`Payment ${status} for user ${userId}, paymentId: ${paymentId}`);
    
    await webhookQueue.add("paymentWebhook", {
        event: status === "SUCCESS" ? "payment.success" : "payment.failed",
        paymentId,
        userId,
        amount,
    });

    return { status };
    },
    { connection: redisConnection }
);

worker.on("completed", (job) => console.log(`Payment job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`Payment job ${job.id} failed:`, err));