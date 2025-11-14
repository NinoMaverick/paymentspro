import express from "express";
import { webhookQueue } from "../queues/webhookQueue.js";

const router = express.Router();

router.post("/queue-webhook", async (req, res) => {
  const { event, payload } = req.body;

  if (!event || !payload) {
    return res.status(400).json({ error: "Missing event or payload" });
  }

  const job = await webhookQueue.add("triggerWebhook", { event, payload });
  res.status(202).json({ message: "Webhook job queued.", jobId: job.id });
});

router.get("/queue-webhook/waiting", async (req, res) => {
  const jobs = await webhookQueue.getWaiting();
  res.json({ waiting: jobs.map(job => ({ id: job.id, data: job.data })) });
});

router.get("/queue-webhook/completed", async (req, res) => {
  const jobs = await webhookQueue.getCompleted();
  res.json({ completed: jobs.map(job => ({ id: job.id, data: job.data })) });
});

export default router;
