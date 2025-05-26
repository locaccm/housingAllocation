import prisma from "../prisma/client";

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
  const {
    LEAD_START,
    LEAD_END,
    LEAN_RENT,
    LEAN_CHARGES,
    LEAD_PAYMENT,
    USEN_ID,
    ACCN_ID,
  } = data;

  if (!USEN_ID || !ACCN_ID) {
    throw new Error("USEN_ID and ACCN_ID are required");
  }

  const accommodation = await prisma.accommodation.findUnique({
    where: { ACCN_ID },
    include: { owner: true, leases: true },
  });
  if (!accommodation) {
    throw new Error("Accommodation not found");
  }

  if (accommodation.USEN_ID !== USEN_ID) {
    throw new Error("You are not the owner of this accommodation");
  }

  const hasActiveLease = await prisma.lease.findFirst({
    where: {
      ACCN_ID,
      LEAB_ACTIVE: true,
      LEAD_END: { gt: new Date() },
    },
  });
  if (hasActiveLease) {
    throw new Error("Accommodation already has an active lease");
  }

  const tenant = await prisma.user.findUnique({
    where: { USEN_ID: data.USEN_ID },
  });
  if (!tenant || tenant.USEC_TYPE !== "tenant") {
    throw new Error("Tenant not valid or not of type 'tenant'");
  }

  const tenantHasActiveLease = await prisma.lease.findFirst({
    where: {
      USEN_ID: data.USEN_ID,
      LEAB_ACTIVE: true,
      LEAD_END: { gt: new Date() },
    },
  });
  if (tenantHasActiveLease) {
    throw new Error("Tenant already has an active lease");
  }

  try {
    const lease = await prisma.lease.create({
      data: {
        LEAD_START: new Date(LEAD_START!),
        LEAD_END: new Date(LEAD_END!),
        LEAN_RENT,
        LEAN_CHARGES,
        LEAD_PAYMENT: LEAD_PAYMENT ? new Date(LEAD_PAYMENT) : null,
        USEN_ID: data.USEN_ID,
        ACCN_ID,
        LEAB_ACTIVE: true,
      },
    });

    await prisma.accommodation.update({
      where: { ACCN_ID },
      data: { ACCB_AVAILABLE: false },
    });

    return lease;
  } catch (error) {
    throw new Error(
      `Failed to create lease. ${error instanceof Error ? error.message : error}`,
    );
  }
};

export const updateLease = async (id: number, data: Partial<LeaseData>) => {
  try {
    const existingLease = await prisma.lease.findUnique({
      where: { LEAN_ID: id },
    });
    if (!existingLease) {
      throw new Error("Lease not found");
    }

    if (data.USEN_ID) {
      const tenant = await prisma.user.findUnique({
        where: { USEN_ID: data.USEN_ID },
      });
      if (!tenant || tenant.USEC_TYPE !== "tenant") {
        throw new Error("Tenant not valid or not of type 'tenant'");
      }

      const tenantHasActiveLease = await prisma.lease.findFirst({
        where: {
          USEN_ID: data.USEN_ID,
          LEAB_ACTIVE: true,
          LEAD_END: { gt: new Date() },
          NOT: { LEAN_ID: id },
        },
      });

      if (tenantHasActiveLease) {
        throw new Error("Tenant already has an active lease");
      }
    }

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
    const lease = await prisma.lease.findUnique({
      where: { LEAN_ID: id },
    });

    if (!lease) {
      throw new Error("Lease not found");
    }

    await prisma.lease.delete({ where: { LEAN_ID: id } });

    if (lease.ACCN_ID) {
      await prisma.accommodation.update({
        where: { ACCN_ID: lease.ACCN_ID },
        data: {
          ACCB_AVAILABLE: true,
          USEN_ID: null,
        },
      });
    }

    return { message: "Lease deleted and accommodation released" };
  } catch (error) {
    throw new Error(
      `Failed to delete lease. ${error instanceof Error ? error.message : error}`,
    );
  }
};

export const getLease = async () => {
  try {
    return await prisma.lease.findMany();
  } catch (error) {
    throw new Error(
      `Failed to retrieve leases. ${error instanceof Error ? error.message : error}`,
    );
  }
};
