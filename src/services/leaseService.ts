import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface LeaseData {
  LEAD_START?: string | Date;
  LEAD_END?: string | Date;
  LEAN_RENT?: number;
  LEAN_CHARGES?: number;
  LEAD_PAYMENT?: string | Date;
  USEN_ID?: number;
  ACCN_ID?: number;
}

export const createLease = async (data: Partial<LeaseData>) => {
  try {
    return await prisma.lease.create({
      data: {
        LEAD_START: data.LEAD_START ? new Date(data.LEAD_START) : null,
        LEAD_END: data.LEAD_END ? new Date(data.LEAD_END) : null,
        LEAN_RENT: data.LEAN_RENT,
        LEAN_CHARGES: data.LEAN_CHARGES,
        LEAD_PAYMENT: data.LEAD_PAYMENT ? new Date(data.LEAD_PAYMENT) : null,
        USEN_ID: data.USEN_ID,
        ACCN_ID: data.ACCN_ID,
      },
    });
  } catch (error) {
    throw new Error(
      `Failed to create lease. ${error instanceof Error ? error.message : error}`,
    );
  }
};

export const updateLease = async (id: number, data: Partial<LeaseData>) => {
  try {
    const updatedData: Partial<LeaseData> = {
      LEAD_START: data.LEAD_START ? new Date(data.LEAD_START) : undefined,
      LEAD_END: data.LEAD_END ? new Date(data.LEAD_END) : undefined,
      LEAN_RENT: data.LEAN_RENT,
      LEAN_CHARGES: data.LEAN_CHARGES,
      LEAD_PAYMENT: data.LEAD_PAYMENT ? new Date(data.LEAD_PAYMENT) : undefined,
      USEN_ID: data.USEN_ID,
      ACCN_ID: data.ACCN_ID,
    };

    return await prisma.lease.update({
      where: { LEAN_ID: id },
      data: updatedData,
    });
  } catch (error) {
    throw new Error(
      `Failed to update lease. ${error instanceof Error ? error.message : error}`,
    );
  }
};

export const deleteLease = async (id: number) => {
  try {
    await prisma.lease.delete({
      where: { LEAN_ID: id },
    });
    return { message: "Lease deleted successfully" };
  } catch (error) {
    throw new Error(
      `Failed to delete lease. ${error instanceof Error ? error.message : error}`,
    );
  }
};
