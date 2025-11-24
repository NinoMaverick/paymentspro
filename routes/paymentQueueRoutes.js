import express from "express";
import { getQueueStatus } from "../jobs/queueStatusService.js";

const router = express.Router();

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