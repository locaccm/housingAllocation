import prisma from "../../prisma/client";

export const createHousingService = async (housingData: any) => {
  return await prisma.accommodation.create({
    data: housingData,
  });
};

export const updateHousingService = async (id: number, updateData: any) => {
  return await prisma.accommodation.update({
    where: { ACCN_ID: id },
    data: updateData,
  });
};

export const deleteHousingService = async (id: number) => {
  return await prisma.accommodation.delete({
    where: { ACCN_ID: id },
  });
};
