import { Queue, Worker, QueueEvents } from "bullmq";
import { redisConnection } from "../redis.js";
import { simulatePayment } from "../jobs/paymentProcessor.js";

describe("Payment Queue Retry Logic", () => {
  let testQueue;
  let worker;

  beforeEach(() => {
    testQueue = new Queue("testPaymentQueue", { connection: redisConnection });
    queueEvents = new QueueEvents("testPaymentQueue", { connection: redisConnection });
  });

  afterEach(async () => {
    await worker?.close();
    await queueEvents?.close();
    await testQueue.drain();
    await testQueue.clean(0, 0);
    await testQueue.close();
  });

  test(
    "job retries when simulatePayment fails and eventually succeeds", 
    async () => {
    let attempt = 0;

    worker = new Worker(
      "testPaymentQueue",
      async (job) => {
        attempt++;
        // simulate failure first 2 attempts
        if (attempt < 3) throw new Error("simulated payment failure");
        return simulatePayment(job.data); // succeeds on 3rd attempt
      },
      { connection: redisConnection }
    );

    const job = await testQueue.add(
      "processPayment",
      { userId: 1, amount: 50 },
      { attempts: 3, 
        backoff: { type: "exponential", delay: 10 } } // short delay for test
    );

    const result = await job.waitUntilFinished(queueEvents);

    expect(result).toBe("success");     
    expect(attempt).toBe(3);            
  });

  test("job fails after all attempts", async () => {
    let attempt = 0;

    worker = new Worker(
      "testPaymentQueue",
      async () => {
        attempt++;
        throw new Error("Always fails");
      },
      { connection: redisConnection }
    );

    const job = await testQueue.add(
      "processPayment",
      { userId: 1, amount: 50 },
      { 
        attempts: 3, 
        backoff: { type: "exponential", delay: 10 } // short delay for test
      } 
    );

    await expect(job.waitUntilFinished(queueEvents))
    .rejects.toThrow("Always fails");
    expect(attempt).toBe(3); // retried twice, failed 3 times
  });
});
