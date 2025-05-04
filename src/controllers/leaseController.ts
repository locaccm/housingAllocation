import { Request, Response } from "express";
import * as leaseService from "../services/leaseService";

export const createLease = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.body.LEAN_RENT) {
      res.status(400).json({ message: "Rent is required" });
      return;
    }

    const lease = await leaseService.createLease(req.body);
    res.status(201).json(lease);
  } catch (error: any) {
    console.error("Error creating lease:", error);
    res.status(500).json({ message: "Creation failed" });
  }
};

export const updateLease = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const lease = await leaseService.updateLease(id, req.body);

    if (!lease) {
      res.status(404).json({ message: "Lease not found" });
      return;
    }

    res.status(200).json(lease);
  } catch (error: any) {
    console.error("Error updating lease:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteLease = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await leaseService.deleteLease(id);
    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting lease:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};
