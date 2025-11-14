export function simulatePayment({ userId }) {
  if (Math.random() < 0.5) {
    throw new Error("simulated API failure");
  }
  return "success";
}
