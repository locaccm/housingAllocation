import request from "supertest";
import prisma from "../../prisma/client";
import app from "../../index";

jest.mock("../../middlewares/requirePermission", () => ({
  requirePermission: () => (req: any, res: any, next: any) => {
    req.user = { USEN_ID: 1, role: "owner" };
    next();
  },
}));

jest.mock("../../prisma/client", () => ({
  __esModule: true,
  default: {
    lease: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    accommodation: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe("Lease routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create lease successfully", async () => {
    (prisma.accommodation.findUnique as jest.Mock).mockResolvedValue({
      USEN_ID: 1,
      leases: [],
      owner: {},
    });
    (prisma.lease.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      USEC_TYPE: "TENANT",
    });
    (prisma.lease.create as jest.Mock).mockResolvedValue({
      LEAN_ID: 123,
    });
    (prisma.accommodation.update as jest.Mock).mockResolvedValue({});

    const res = await request(app)
      .post("/lease")
      .set("Authorization", "Bearer fake-token")
      .send({
        USEN_ID: 1,
        ACCN_ID: 1,
        LEAD_START: "2025-01-01",
        LEAD_END: "2025-12-31",
        LEAN_RENT: 100,
        LEAN_CHARGES: 50,
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ LEAN_ID: 123 });
  });

  it("GET /lease - returns 400 if userId is missing", async () => {
    const res = await request(app).get("/lease");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Missing or invalid userId" });
  });

  it("GET /lease - returns 400 if userId is array", async () => {
    const res = await request(app)
      .get("/lease")
      .query({ userId: ["1", "2"] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Missing or invalid userId" });
  });

  it("GET /lease - returns 400 if userId is invalid format", async () => {
    const res = await request(app).get("/lease").query({ userId: "abc" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid userId format" });
  });

  it("GET /lease - returns 404 if user not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/lease").query({ userId: "1" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "User not found" });
  });

  it("GET /lease - returns leases for TENANT user", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      USEN_ID: 1,
      USEC_TYPE: "TENANT",
    });
    const mockLeases = [{ LEAN_ID: 123, USEN_ID: 1 }];
    (prisma.lease.findMany as jest.Mock).mockResolvedValue(mockLeases);

    const res = await request(app).get("/lease").query({ userId: "1" });

    expect(res.status).toBe(200);
    expect(prisma.lease.findMany).toHaveBeenCalledWith({
      where: { USEN_ID: 1 },
    });
    expect(res.body).toEqual(mockLeases);
  });

  it("GET /lease - returns leases for OWNER user", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      USEN_ID: 2,
      USEC_TYPE: "OWNER",
    });
    const mockAccommodations = [{ ACCN_ID: 10 }, { ACCN_ID: 20 }];
    (prisma.accommodation.findMany as jest.Mock).mockResolvedValue(
      mockAccommodations,
    );
    const mockLeases = [
      { LEAN_ID: 101, ACCN_ID: 10 },
      { LEAN_ID: 102, ACCN_ID: 20 },
    ];
    (prisma.lease.findMany as jest.Mock).mockResolvedValue(mockLeases);

    const res = await request(app).get("/lease").query({ userId: "2" });

    expect(res.status).toBe(200);
    expect(prisma.accommodation.findMany).toHaveBeenCalledWith({
      where: { USEN_ID: 2 },
      select: { ACCN_ID: true },
    });
    expect(prisma.lease.findMany).toHaveBeenCalledWith({
      where: { ACCN_ID: { in: [10, 20] } },
    });
    expect(res.body).toEqual(mockLeases);
  });

  it("GET /lease - returns 403 for unauthorized user type", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      USEN_ID: 3,
      USEC_TYPE: "ADMIN",
    });

    const res = await request(app).get("/lease").query({ userId: "3" });

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: "Unauthorized user type" });
  });

  it("GET /lease - returns 500 on internal server error", async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error"),
    );

    const res = await request(app).get("/lease").query({ userId: "1" });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});
