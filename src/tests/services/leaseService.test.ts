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
  });

  it("should throw error when deleting non-existent lease", async () => {
    await expect(leaseService.deleteLease(999999)).rejects.toThrow(
      "Failed to delete lease",
    );
  });
});
