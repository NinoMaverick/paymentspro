export function simulatePayment({ userId, amount, paymentId }) {
  
  const success = Math.random() > 0.2;  // 80% success rate

  if (success) {
    return "SUCCESS";
  } else {
    return "FAILED"; // worker will handle retries
  }
}