import * as leaseService from "../../services/leaseService";
import Decimal from "decimal.js";

const mockLease = {
  LEAN_ID: 1,
  LEAD_START: new Date("2025-05-01"),
  LEAD_END: new Date("2026-05-01"),
  LEAD_PAYMENT: new Date("2025-05-05"),
  LEAN_RENT: new Decimal(800), 
  LEAN_CHARGES: new Decimal(100),
  LEAB_ACTIVE: true,
  USEN_ID: 1,
  ACCN_ID: 2,
};

describe("Lease Service", () => {
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
    const mockLeases = [mockLease];
    jest.spyOn(leaseService, "getLease").mockResolvedValue(mockLeases);

    const leases = await leaseService.getLease();
    expect(Array.isArray(leases)).toBe(true);
    expect(leases.length).toBeGreaterThan(0);
    expect(leases).toEqual(expect.arrayContaining([expect.objectContaining({
      LEAN_ID: mockLease.LEAN_ID,
      LEAD_START: mockLease.LEAD_START,
    })]));
  });

});
