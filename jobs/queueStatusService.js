import { paymentQueue } from "../queues/paymentQueue.js";

export const getQueueStatus = {
    waiting: async () => {
    const jobs = await paymentQueue.getWaiting();
    return jobs.map(job => ({ id: job.id, data: job.data }));
  },

  active: async () => {
    const jobs = await paymentQueue.getActive();
    return jobs.map(job => ({ id: job.id, data: job.data }));
  },

  completed: async () => {
    const jobs = await paymentQueue.getCompleted();
    return jobs.map(job => ({ id: job.id, data: job.data }));
  },
};