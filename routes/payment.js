import express from "express";
import { prisma } from "../lib/prisma.js";
import { enqueuePaymentJob } from "../jobs/enqueuePaymentJob";

const router = express.Router();

router.post("/create-payment", async (req, res) => {
    const { userId, amount } = req.body;

    if (!userId || !amount ) {
        return res.status(400).json({ error: "userId and amount are required"})
    };

    try {
        const payment = await prisma.payment.create({
            data: {
                userId,
                amount,
                status: "PENDING",
            },
        });
        await enqueuePaymentJob({ userId, amount, paymentId: payment.id });

        res.status(202).json({
            message: "Payment job queued",
            paymentId: payment.id,
        });
        
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create payment" });
    }
})

router.get("/verify-payment/:paymentId", async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    return res.status(400).json({ error: "paymentId is required" });
  }

  try {
    
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json({
      paymentId: payment.id,
      userId: payment.userId,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});