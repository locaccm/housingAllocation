import { Router } from "express";
import {
  createHousingController,
  updateHousingController,
  deleteHousingController,
} from "../controllers/housingController";

const router = Router();

router.post("/", createHousingController);
router.put("/:id", updateHousingController);
router.delete("/:id", deleteHousingController);

export default router;
