import { Request, Response } from "express";
import * as leaseService from "../services/leaseService";

export const createLease = async (req: Request, res: Response) => {
  try {
    const lease = await leaseService.createLease(req.body);
    res.status(201).json(lease);
  } catch (error) {
    console.error("Error creating lease:", error);
    res.status(500).json({ error: "Failed to create lease." });
  }
};

export const updateLease = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const lease = await leaseService.updateLease(id, req.body);
    res.status(200).json(lease);
  } catch (error) {
    console.error("Error updating lease:", error);
    res.status(500).json({ error: "Failed to update lease." });
  }
};

export const deleteLease = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await leaseService.deleteLease(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting lease:", error);
    res.status(500).json({ error: "Failed to delete lease." });
  }
};
