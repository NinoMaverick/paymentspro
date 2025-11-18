import { Worker } from "bullmq";
import { redisConnection } from "../redis.js";
import { handlePaymentSuccess, handlePaymentFailed} from "../handlers/webhookHandler.js";

const worker = new Worker(
  "webhookQueue",
  async (job) => {
    const { event, payload } = job.data;
    const { paymentId, userId, amount } = payload;

    console.log(`Webhook: ${event} for payment ${paymentId}`);

    switch (event) {
      case "payment.success":
        await handlePaymentSuccess({ paymentId, userId, amount });
        break;
    
      case "payment.failed":
        await handlePaymentFailed({ paymentId, userId, amount });
        break;

      default:
         console.log(`Webhook triggered for event ${job.data.event}`);
    }
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log(`Webhook job ${job.id} completed`);
});
worker.on("failed", (job, err) => {
  console.error(`Webhook job ${job.id} failed:`, err);
});

export default worker;