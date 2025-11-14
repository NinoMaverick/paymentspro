import request from "supertest";
import app from "../app"; 

describe("PaymentsPro API", () => {
  
  describe("POST /queue-payment", () => {
    it("should enqueue a payment job successfully", async () => {
      const res = await request(app)
        .post("/queue-payment")
        .send({ userId: 1, amount: 1000 });

      expect(res.statusCode).toBe(202);
      expect(res.body.message).toBe("Payment job queued.");
      expect(res.body.jobId).toBeDefined(); 
    });
  });

  describe("GET /queue-waiting", () => {
    it("should return jobs in the waiting state", async () => {
      const res = await request(app).get("/queue-waiting");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.waiting)).toBe(true);

      if (res.body.waiting.length > 0) {
        expect(res.body.waiting[0]).toHaveProperty("id");
        expect(res.body.waiting[0]).toHaveProperty("data");
      }
    });
  });

  describe("GET /queue-active", () => {
    it("should return jobs in the active state", async () => {
      const res = await request(app).get("/queue-active");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.active)).toBe(true);
    });
  });

  describe("GET /queue-completed", () => {
    it("should return jobs in the completed state", async () => {
      const res = await request(app).get("/queue-completed");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.completed)).toBe(true);
    });
  });
});
