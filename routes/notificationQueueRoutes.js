import express from "express";
import { notificationQueue } from "../queues/notificationQueue.js";

const router = express.Router();

router.post("/queue-notification", async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "Missing userId or message" });
  }

  const job = await notificationQueue.add("sendNotification", { userId, message });
  res.status(202).json({ message: "Notification job queued.", jobId: job.id });
});

router.get("/queue-notification/waiting", async (req, res) => {
  const jobs = await notificationQueue.getWaiting();
  res.json({ waiting: jobs.map(job => ({ id: job.id, data: job.data })) });
});

router.get("/queue-notification/completed", async (req, res) => {
  const jobs = await notificationQueue.getCompleted();
  res.json({ completed: jobs.map(job => ({ id: job.id, data: job.data })) });
});

export default router;
