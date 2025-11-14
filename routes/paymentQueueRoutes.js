import express from "express";
import { enqueuePaymentJob } from "../jobs/enqueuePaymentJob";
import { getQueueStatus } from "../jobs/queueStatusService.js";

const router = express.Router();

router.post("/queue-payment", async (req, res) => {
    const { userId, amount } = req.body;
    try {
      const job = await enqueuePaymentJob({ userId, amount });
      res.status(202).json({ message: "Payment job queued.", jobId: job.id });    
    } catch (error) {
      res.status(400).json({ error: error.message });   
    }
 
});

router.get("/queue-waiting", async (req, res) => {
    const waiting = await getQueueStatus.waiting();
    res.json({ waiting });
});

router.get("/queue-active", async (req, res) => {
    const active = await getQueueStatus.active();
    res.json({ active });
});

router.get("/queue-completed", async (req, res) => {
    const completed = await getQueueStatus.completed();
    res.json({ completed });
});

export default router;