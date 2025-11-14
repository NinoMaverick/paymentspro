import { paymentQueue } from "../queues/paymentQueue";

export const enqueuePaymentJob = async({ userId, amount }) => {
    if (!userId || !amount) throw new Error ("missing userId or amount");

    const job = await paymentQueue.add(
            "processPayment", 
            { userId, amount }, 
            {
                attempts: 3,
                backoff: { type: "exponential", delay: 1000 }
            }
        );
    return job;
};