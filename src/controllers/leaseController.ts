import { Request, Response } from "express";
import * as leaseService from "../services/leaseService";

// Fonction de validation des dates
const isValidDate = (date: string) => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

export const createLease = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.body.LEAN_RENT) {
      res.status(400).json({ message: "Rent is required" });
      return;
    }
    if (!req.body.LEAN_CHARGES) {
      res.status(400).json({ message: "Charges are required" });
      return;
    }
    if (req.body.LEAN_RENT === null) {
      res.status(400).json({ message: "Rent cannot be null" });
      return;
    }
    if (!req.body.LEAD_START || !isValidDate(req.body.LEAD_START)) {
      res.status(400).json({ message: "Invalid date format for LEAD_START" });
      return;
    }
    if (!req.body.LEAD_END || !isValidDate(req.body.LEAD_END)) {
      res.status(400).json({ message: "Invalid date format for LEAD_END" });
      return;
    }

    const lease = await leaseService.createLease(req.body);
    res.status(201).json(lease);
  } catch (error: any) {
    console.error("Error creating lease:", error);
    res.status(500).json({ message: "Creation failed", error: error.message });
  }
};

export const updateLease = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      res.status(400).json({ message: "Invalid lease ID" });
      return;
    }

    const lease = await leaseService.updateLease(id, req.body);

    if (!lease) {
      res.status(404).json({ message: "Lease not found" });
      return;
    }

    res.status(200).json(lease);
  } catch (error: any) {
    console.error("Error updating lease:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

export const deleteLease = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      res.status(400).json({ message: "Invalid lease ID" });
      return;
    }

    const lease = await leaseService.deleteLease(id);
    if (!lease) {
      res.status(404).json({ message: "Lease not found" });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting lease:", error);
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
