import { PrismaClient } from "@prisma/client";
import * as leaseService from "../services/leaseService";

const prisma = new PrismaClient();

describe("Lease Service", () => {
  let createdLeaseId: number;

  const leaseData = {
    LEAD_START: new Date("2025-05-01"),
    LEAD_END: new Date("2026-05-01"),
    LEAD_PAYMENT: new Date("2025-05-05"),
    LEAN_RENT: 800,
    LEAN_CHARGES: 100,
    USEN_ID: 1,
    ACCN_ID: 1,
  };

  afterAll(async () => {
    await prisma.lease.deleteMany();
    await prisma.$disconnect();
  });

  it("should throw error when updating non-existent lease", async () => {
    await expect(
      leaseService.updateLease(999999, { LEAN_RENT: 1000 }),
    ).rejects.toThrow("Failed to update lease");
  });

  it("should throw error when deleting non-existent lease", async () => {
    await expect(leaseService.deleteLease(999999)).rejects.toThrow(
      "Failed to delete lease",
    );
  });
});
