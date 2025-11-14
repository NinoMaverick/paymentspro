import { simulatePayment } from "../jobs/paymentProcessor";

describe("simulatePayment", () => {
    test("throws an error when Math.random() < 0.5", () => {
        jest.spyOn(Math, "random").mockReturnValue(0.1);
        expect(() => simulatePayment({ userId: 1 }))
            .toThrow("simulated API failure");
        
        Math.random.mockRestore();
    });

    test("succeeds when Math.random() >= 0.5", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.9); 
    const result = simulatePayment({ userId: 1 });
    expect(result).toBe("success");
    Math.random.mockRestore();
  });
});