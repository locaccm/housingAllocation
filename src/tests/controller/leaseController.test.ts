import * as leaseService from "../../services/leaseService";
import * as leaseController from "../../controllers/leaseController";
import prisma from "../../prisma/client";

jest.mock("../../prisma/client", () => ({
  __esModule: true,
  default: {
    lease: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

describe("Lease Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw if USEN_ID or ACCN_ID missing", async () => {
    await expect(leaseService.createLease({})).rejects.toThrow(
      "USEN_ID and ACCN_ID are required",
    );
  });

  it("should throw if accommodation not found", async () => {
    (prisma.accommodation.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      leaseService.createLease({ USEN_ID: 1, ACCN_ID: 1 }),
    ).rejects.toThrow("Accommodation not found");
  });

  it("should throw if user is not owner of accommodation", async () => {
    (prisma.accommodation.findUnique as jest.Mock).mockResolvedValue({
      USEN_ID: 99,
      leases: [],
      owner: {},
    });
    await expect(
      leaseService.createLease({ USEN_ID: 1, ACCN_ID: 1 }),
    ).rejects.toThrow("You are not the owner of this accommodation");
  });

  it("should throw if accommodation already has active lease", async () => {
    (prisma.accommodation.findUnique as jest.Mock).mockResolvedValue({
      USEN_ID: 1,
      leases: [],
      owner: {},
    });
    (prisma.lease.findFirst as jest.Mock).mockResolvedValue({});
    await expect(
      leaseService.createLease({ USEN_ID: 1, ACCN_ID: 1 }),
    ).rejects.toThrow("Accommodation already has an active lease");
  });

  it("should throw if tenant is invalid or not tenant type", async () => {
    (prisma.accommodation.findUnique as jest.Mock).mockResolvedValue({
      USEN_ID: 1,
      leases: [],
      owner: {},
    });
    (prisma.lease.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      leaseService.createLease({ USEN_ID: 1, ACCN_ID: 1 }),
    ).rejects.toThrow("Tenant not valid or not of type 'tenant'");
  });

  it("should throw if tenant already has active lease", async () => {
    (prisma.accommodation.findUnique as jest.Mock).mockResolvedValue({
      USEN_ID: 1,
      leases: [],
      owner: {},
    });
    (prisma.lease.findFirst as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({});
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      USEC_TYPE: "tenant",
    });
    await expect(
      leaseService.createLease({ USEN_ID: 1, ACCN_ID: 1 }),
    ).rejects.toThrow("Tenant already has an active lease");
  });

  it("should create lease successfully", async () => {
    (prisma.accommodation.findUnique as jest.Mock).mockResolvedValue({
      USEN_ID: 1,
      leases: [],
      owner: {},
    });
    (prisma.lease.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      USEC_TYPE: "tenant",
    });
    (prisma.lease.create as jest.Mock).mockResolvedValue({ LEAN_ID: 123 });
    (prisma.accommodation.update as jest.Mock).mockResolvedValue({});

    const lease = await leaseService.createLease({
      USEN_ID: 1,
      ACCN_ID: 1,
      LEAD_START: new Date(),
      LEAD_END: new Date(),
      LEAN_RENT: 100,
      LEAN_CHARGES: 50,
    });

    expect(lease).toEqual({ LEAN_ID: 123 });
  });

  it("should throw if createLease prisma.create fails", async () => {
    (prisma.accommodation.findUnique as jest.Mock).mockResolvedValue({
      USEN_ID: 1,
      leases: [],
      owner: {},
    });
    (prisma.lease.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      USEC_TYPE: "tenant",
    });
    (prisma.lease.create as jest.Mock).mockRejectedValue(
      new Error("DB failure"),
    );

    await expect(
      leaseService.createLease({
        USEN_ID: 1,
        ACCN_ID: 1,
        LEAD_START: new Date(),
        LEAD_END: new Date(),
        LEAN_RENT: 100,
        LEAN_CHARGES: 50,
      }),
    ).rejects.toThrow(/Failed to create lease/);
  });

  it("should throw if lease to update not found", async () => {
    (prisma.lease.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(leaseService.updateLease(999, {})).rejects.toThrow(
      "Lease not found",
    );
  });

  it("should throw if tenant invalid on update", async () => {
    (prisma.lease.findUnique as jest.Mock).mockResolvedValue({ LEAN_ID: 1 });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(leaseService.updateLease(1, { USEN_ID: 1 })).rejects.toThrow(
      "Tenant not valid or not of type 'tenant'",
    );
  });

  it("should throw if tenant has active lease on update", async () => {
    (prisma.lease.findUnique as jest.Mock).mockResolvedValue({ LEAN_ID: 1 });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      USEC_TYPE: "tenant",
    });
    (prisma.lease.findFirst as jest.Mock).mockResolvedValue({ LEAN_ID: 2 });
    await expect(leaseService.updateLease(1, { USEN_ID: 1 })).rejects.toThrow(
      "Tenant already has an active lease",
    );
  });

  it("should update lease successfully", async () => {
    (prisma.lease.findUnique as jest.Mock).mockResolvedValue({ LEAN_ID: 1 });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      USEC_TYPE: "tenant",
    });
    (prisma.lease.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.lease.update as jest.Mock).mockResolvedValue({ LEAN_ID: 1 });

    const updated = await leaseService.updateLease(1, {
      LEAN_RENT: 150,
      USEN_ID: 1,
    });
    expect(updated).toEqual({ LEAN_ID: 1 });
  });

  it("should throw if updateLease prisma.update fails", async () => {
    (prisma.lease.findUnique as jest.Mock).mockResolvedValue({ LEAN_ID: 1 });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      USEC_TYPE: "tenant",
    });
    (prisma.lease.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.lease.update as jest.Mock).mockRejectedValue(
      new Error("DB update failure"),
    );

    await expect(
      leaseService.updateLease(1, { LEAN_RENT: 150 }),
    ).rejects.toThrow(/Failed to update lease/);
  });

  it("should throw if lease to delete not found", async () => {
    (prisma.lease.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(leaseService.deleteLease(999)).rejects.toThrow(
      "Lease not found",
    );
  });

  it("should delete lease and release accommodation", async () => {
    (prisma.lease.findUnique as jest.Mock).mockResolvedValue({
      LEAN_ID: 1,
      ACCN_ID: 10,
    });
    (prisma.lease.delete as jest.Mock).mockResolvedValue({});
    (prisma.accommodation.update as jest.Mock).mockResolvedValue({});

    const result = await leaseService.deleteLease(1);
    expect(prisma.lease.delete).toHaveBeenCalledWith({ where: { LEAN_ID: 1 } });
    expect(prisma.accommodation.update).toHaveBeenCalledWith({
      where: { ACCN_ID: 10 },
      data: { ACCB_AVAILABLE: true, USEN_ID: null },
    });
    expect(result).toEqual({
      message: "Lease deleted and accommodation released",
    });
  });

  it("should delete lease without accommodation update if no ACCN_ID", async () => {
    (prisma.lease.findUnique as jest.Mock).mockResolvedValue({ LEAN_ID: 1 });
    (prisma.lease.delete as jest.Mock).mockResolvedValue({});

    const result = await leaseService.deleteLease(1);
    expect(prisma.accommodation.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      message: "Lease deleted and accommodation released",
    });
  });

  it("should throw if deleteLease prisma.delete fails", async () => {
    (prisma.lease.findUnique as jest.Mock).mockResolvedValue({
      LEAN_ID: 1,
      ACCN_ID: 10,
    });
    (prisma.lease.delete as jest.Mock).mockRejectedValue(
      new Error("DB delete failure"),
    );

    await expect(leaseService.deleteLease(1)).rejects.toThrow(
      /Failed to delete lease/,
    );
  });

  it("should get leases successfully", async () => {
    (prisma.lease.findMany as jest.Mock).mockResolvedValue([{ LEAN_ID: 1 }]);
    const leases = await leaseService.getLease();
    expect(leases).toEqual([{ LEAN_ID: 1 }]);
  });

  it("should throw if getLease prisma.findMany fails", async () => {
    (prisma.lease.findMany as jest.Mock).mockRejectedValue(
      new Error("DB findMany failure"),
    );
    await expect(leaseService.getLease()).rejects.toThrow(
      /Failed to retrieve leases/,
    );
  });
});

describe("leaseController.createLease validation", () => {
  const mockStatus = jest.fn().mockReturnThis();
  const mockJson = jest.fn();

  beforeEach(() => {
    mockStatus.mockClear();
    mockJson.mockClear();
  });

  it("should return 400 if LEAN_CHARGES is missing or falsy", async () => {
    const req = {
      body: {
        LEAN_CHARGES: 0, // falsy
        LEAN_RENT: 100,
        LEAD_START: new Date().toISOString(),
        LEAD_END: new Date().toISOString(),
      },
    };
    const res = { status: mockStatus, json: mockJson };

    await leaseController.createLease(req as any, res as any);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: "Charges are required" });
  });

  it("should return 400 if LEAD_START is missing", async () => {
    const req = {
      body: {
        LEAN_CHARGES: 50,
        LEAN_RENT: 100,
        LEAD_START: null,
        LEAD_END: new Date().toISOString(),
      },
    };
    const res = { status: mockStatus, json: mockJson };

    await leaseController.createLease(req as any, res as any);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      message: "Invalid date format for LEAD_START",
    });
  });

  it("should return 400 if LEAD_START is invalid date", async () => {
    const req = {
      body: {
        LEAN_CHARGES: 50,
        LEAN_RENT: 100,
        LEAD_START: "not-a-date",
        LEAD_END: new Date().toISOString(),
      },
    };
    const res = { status: mockStatus, json: mockJson };

    await leaseController.createLease(req as any, res as any);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      message: "Invalid date format for LEAD_START",
    });
  });

  it("should return 400 if LEAD_END is missing", async () => {
    const req = {
      body: {
        LEAN_CHARGES: 50,
        LEAN_RENT: 100,
        LEAD_START: new Date().toISOString(),
        LEAD_END: null,
      },
    };
    const res = { status: mockStatus, json: mockJson };

    await leaseController.createLease(req as any, res as any);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      message: "Invalid date format for LEAD_END",
    });
  });

  it("should return 400 if LEAD_END is invalid date", async () => {
    const req = {
      body: {
        LEAN_CHARGES: 50,
        LEAN_RENT: 100,
        LEAD_START: new Date().toISOString(),
        LEAD_END: "invalid-date",
      },
    };
    const res = { status: mockStatus, json: mockJson };

    await leaseController.createLease(req as any, res as any);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      message: "Invalid date format for LEAD_END",
    });
  });

  it("should return 404 if no leases found", async () => {
    jest.spyOn(leaseService, "getLease").mockResolvedValue([]);
    const req = {};
    const res = { status: mockStatus, json: mockJson };

    await leaseController.getLease(req as any, res as any);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ message: "No leases found" });
  });

  it("should return 500 on service error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    jest
      .spyOn(leaseService, "getLease")
      .mockRejectedValue(new Error("DB error"));
    const req = {};
    const res = { status: mockStatus, json: mockJson };

    await leaseController.getLease(req as any, res as any);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      message: "Failed to retrieve leases",
      error: "DB error",
    });
  });
});
