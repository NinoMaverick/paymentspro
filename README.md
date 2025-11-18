PaymentsPro — Internal Fintech Engine

PaymentsPro is a backend-focused fintech simulation platform designed to mimic real-world payment flows. It provides an internal payment processing system with asynchronous job queues, wallet management, and a complete ledger system — all without integrating any external payment gateway.

Key Features

Async Payment Processing: Payment jobs are queued and processed asynchronously, simulating real-world gateway delays and success/failure scenarios.

Internal Webhook System: Mimics how gateways like Paystack and Flutterwave confirm payments asynchronously via webhooks.

Wallet Management: Each user has a wallet that is updated only through verified payment events.

Ledger Tracking: Every credit, debit, and failed transaction is recorded for complete auditability.

Payment Verification Endpoint: Clients can verify any payment’s status (PENDING, SUCCESS, FAILED) using its unique paymentId.

Resilient and Modular: Built with Node.js, Express, Prisma, and BullMQ, making it easy to extend, test, or eventually integrate with real payment gateways.


Use Case

PaymentsPro is ideal for:

Developers learning payment system architecture.

Fintech prototyping without relying on external gateways.

Testing async job processing, wallet, and ledger logic.