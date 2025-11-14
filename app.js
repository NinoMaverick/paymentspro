import express from "express";
import paymentQueueRoutes from "./routes/paymentQueueRoutes.js";
import notificationQueueRoutes from "./routes/notificationQueueRoutes.js";
import webhookQueueRoutes from "./routes/webhookQueueRoutes.js";
const app = express();
app.use(express.json());

app.use("/api", paymentQueueRoutes);
app.use("/api", notificationQueueRoutes);
app.use("/api", webhookQueueRoutes);
app.get("/", (req, res) => {
    res.send("PaymentsPro API is running...")
});

export default app;