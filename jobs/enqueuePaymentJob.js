import { paymentQueue } from "../queues/paymentQueue.js";

export const enqueuePaymentJob = async({ userId, amount }) => {
    if (!userId || !amount || !paymentId) 
        throw new Error ("missing userId, amount, or paymentId");

    const job = await paymentQueue.add(
            "processPayment", 
            { userId, amount, paymentId}, 
            {
                attempts: 3,
                backoff: { type: "exponential", delay: 1000 }
            }
        );
    return job;
};