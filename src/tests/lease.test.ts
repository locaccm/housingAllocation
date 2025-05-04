import request from "supertest";
import express from "express";
import leaseRoutes from "../routes/leaseRoute";
import * as leaseService from "../services/leaseService";
jest.mock("../services/leaseService");

const app = express();
app.use(express.json());
app.use("/lease", leaseRoutes);

describe("Lease Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockLease = {
    LEAN_ID: 1,
    LEAD_START: "2025-05-01T00:00:00.000Z",
    LEAD_END: "2026-05-01T00:00:00.000Z",
    LEAD_PAYMENT: "2025-05-05T00:00:00.000Z",
    LEAN_RENT: 800,
    LEAN_CHARGES: 100,
    USEN_ID: 1,
    ACCN_ID: 1
  };
  

  it("should create a lease", async () => {
    (leaseService.createLease as jest.Mock).mockResolvedValue(mockLease);

    const response = await request(app)
      .post("/lease")
      .send(mockLease);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockLease);
    expect(leaseService.createLease).toHaveBeenCalledWith(mockLease);
  });

  it("should update a lease", async () => {
    (leaseService.updateLease as jest.Mock).mockResolvedValue(mockLease);

    const response = await request(app)
      .put("/lease/1")
      .send({ LEAN_RENT: 1000 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLease);
    expect(leaseService.updateLease).toHaveBeenCalledWith(1, { LEAN_RENT: 1000 });
  });

  it("should delete a lease", async () => {
    (leaseService.deleteLease as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/lease/1");

    expect(response.status).toBe(204);
    expect(leaseService.deleteLease).toHaveBeenCalledWith(1);
  });
});
