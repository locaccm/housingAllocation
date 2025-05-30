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
    },
    accommodation: {
      findUnique: jest.fn(),
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
});
