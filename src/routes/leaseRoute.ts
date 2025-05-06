import { Router } from "express";
import * as leaseController from "../controllers/leaseController";

/**
 * @swagger
 * tags:
 *   name: Lease
 *   description: API for managing leases
 */

const router = Router();

/**
 * @swagger
 * /lease:
 *   post:
 *     summary: Create a new lease
 *     tags: [Lease]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaseId:
 *                 type: string
 *                 description: The unique identifier of the lease
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Lease start date
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Lease end date
 *     responses:
 *       201:
 *         description: Lease created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", leaseController.createLease);

/**
 * @swagger
 * /lease/{id}:
 *   put:
 *     summary: Update an existing lease
 *     tags: [Lease]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The lease ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaseId:
 *                 type: string
 *                 description: The unique identifier of the lease
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Lease start date
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Lease end date
 *     responses:
 *       200:
 *         description: Lease updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Lease not found
 */
router.put("/:id", leaseController.updateLease);

/**
 * @swagger
 * /lease/{id}:
 *   delete:
 *     summary: Delete a lease
 *     tags: [Lease]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The lease ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lease deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Lease not found
 */
router.delete("/:id", leaseController.deleteLease);

export default router;
