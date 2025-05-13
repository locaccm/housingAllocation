import { PrismaClient } from "@prisma/client";
import * as leaseService from "../../services/leaseService";

const prisma = new PrismaClient();

describe("Lease Service", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should throw error when updating non-existent lease", async () => {
    await expect(
      leaseService.updateLease(999999, { LEAN_RENT: 1000 }),
    ).rejects.toThrow("Failed to update lease");
  }, 10000);

  it("should throw error when deleting non-existent lease", async () => {
    await expect(leaseService.deleteLease(999999)).rejects.toThrow(
      "Failed to delete lease",
    );
  }, 10000);

  it("should return a list of leases", async () => {
    const lease = await prisma.lease.create({
      data: {
        LEAD_START: new Date("2025-01-01"),
        LEAD_END: new Date("2025-12-31"),
        LEAD_PAYMENT: new Date("2025-01-05"),
        LEAN_RENT: 800,
        LEAN_CHARGES: 100,
        USEN_ID: 1,
        ACCN_ID: 2,
      },
    });
    const leases = await leaseService.getLease();
    expect(Array.isArray(leases)).toBe(true);
    expect(leases.length).toBeGreaterThan(0);
    expect(leases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          LEAN_ID: lease.LEAN_ID,
          LEAD_START: lease.LEAD_START,
        }),
      ]),
    );
    await prisma.lease.delete({ where: { LEAN_ID: lease.LEAN_ID } });
  }, 10000);
});
