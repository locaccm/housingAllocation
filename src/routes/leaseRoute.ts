/* eslint-disable jsdoc/check-tag-names */
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
 *             required:
 *               - LEAD_START
 *               - LEAD_END
 *               - LEAN_RENT
 *               - LEAN_CHARGES
 *               - USEN_ID
 *               - ACCN_ID
 *             properties:
 *               LEAD_START:
 *                 type: string
 *                 format: date
 *               LEAD_END:
 *                 type: string
 *                 format: date
 *               LEAN_RENT:
 *                 type: number
 *               LEAN_CHARGES:
 *                 type: number
 *               LEAD_PAYMENT:
 *                 type: string
 *                 format: date
 *               USEN_ID:
 *                 type: integer
 *               ACCN_ID:
 *                 type: integer
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
 *         description: ID of the lease to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               LEAD_START:
 *                 type: string
 *                 format: date
 *               LEAD_END:
 *                 type: string
 *                 format: date
 *               LEAN_RENT:
 *                 type: number
 *               LEAN_CHARGES:
 *                 type: number
 *               LEAD_PAYMENT:
 *                 type: string
 *                 format: date
 *               USEN_ID:
 *                 type: integer
 *               ACCN_ID:
 *                 type: integer
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
 *         description: ID of the lease to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Lease deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Lease not found
 */
router.delete("/:id", leaseController.deleteLease);

export default router;
