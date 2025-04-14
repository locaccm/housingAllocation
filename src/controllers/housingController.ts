import { Request, Response } from "express";
import {
  createHousingService,
  updateHousingService,
  deleteHousingService,
} from "../services/housingService";

export const createHousingController = async (req: Request, res: Response) => {
  try {
    const housing = await createHousingService(req.body);
    res.status(201).json(housing);
  } catch (error) {
    res.status(400).json({
      error: (error as Error).message,
    });
  }
};

export const updateHousingController = async (req: Request, res: Response) => {
  try {
    const updated = await updateHousingService(Number(req.params.id), req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteHousingController = async (req: Request, res: Response) => {
  try {
    await deleteHousingService(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      error: (error as Error).message,
    });
  }
};
