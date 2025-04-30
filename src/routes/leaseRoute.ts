import { Router } from "express";
import * as leaseController from "../controllers/leaseController";

const router = Router();

router.post("/", leaseController.createLease);
router.put("/:id", leaseController.updateLease);
router.delete("/:id", leaseController.deleteLease);

export default router;
