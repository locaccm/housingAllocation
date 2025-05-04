import request from "supertest";
import app, { server } from "../index";
import * as leaseService from "../services/leaseService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

jest.mock("../services/leaseService");

describe("Lease Controller", () => {
  const mockLease = {
    LEAN_ID: 1,
    LEAD_START: "2025-05-01T00:00:00.000Z",
    LEAD_END: "2026-05-01T00:00:00.000Z",
    LEAD_PAYMENT: "2025-05-05T00:00:00.000Z",
    LEAN_RENT: 800,
    LEAN_CHARGES: 100,
    USEN_ID: 1,
    ACCN_ID: 1,
  };

  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a lease", async () => {
    (leaseService.createLease as jest.Mock).mockResolvedValue(mockLease);
    const response = await request(app).post("/lease").send(mockLease);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockLease);
  });

  it("should handle error when creating a lease", async () => {
    (leaseService.createLease as jest.Mock).mockRejectedValue(
      new Error("Creation failed"),
    );
    const response = await request(app).post("/lease").send(mockLease);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Creation failed");
  });

  it("should return error for null values in required fields", async () => {
    const nullLease = { ...mockLease, LEAN_RENT: null };
    const response = await request(app).post("/lease").send(nullLease);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Rent is required");
  });

  it("should handle invalid date format in lease creation", async () => {
    const invalidDateLease = { ...mockLease, LEAD_START: "invalid-date" };
    const response = await request(app).post("/lease").send(invalidDateLease);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid date format for LEAD_START");
  });

  it("should update a lease", async () => {
    (leaseService.updateLease as jest.Mock).mockResolvedValue(mockLease);
    const response = await request(app)
      .put("/lease/1")
      .send({ LEAN_RENT: 1000 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLease);
  });

  it("should handle error when updating a lease", async () => {
    (leaseService.updateLease as jest.Mock).mockRejectedValue(
      new Error("Update failed"),
    );
    const response = await request(app)
      .put("/lease/1")
      .send({ LEAN_RENT: 1000 });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Update failed");
  });

  it("should handle error when deleting a lease", async () => {
    (leaseService.deleteLease as jest.Mock).mockRejectedValue(
      new Error("Delete failed"),
    );
    const response = await request(app).delete("/lease/1");
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Delete failed");
  });
});
