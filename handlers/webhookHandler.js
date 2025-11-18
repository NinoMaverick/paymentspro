import { prisma } from "../lib/prisma.js";

export async function handlePaymentSuccess({ paymentId, userId, amount }) {
  
  let wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        userId,
        balance: 0
      }
    });
  }

  // credit wallet + write ledger entry atomically
  await prisma.$transaction([
    prisma.wallet.update({
      where: { userId },
      data: {
        balance: wallet.balance + amount
      }
    }),

    prisma.ledger.create({
      data: {
        userId,
        type: "CREDIT",
        amount,
        reference: paymentId,
        status: "SUCCESS"
      }
    })
  ]);

  console.log(`Wallet credited: user ${userId}, amount ${amount}`);
}


export async function handlePaymentFailed({ paymentId, userId, amount }) {
  await prisma.ledger.create({
    data: {
      userId,
      type: "CREDIT",
      amount,
      reference: paymentId,
      status: "FAILED"
    }
  });

  console.log(`Recorded failed payment for user ${userId}`);
}
