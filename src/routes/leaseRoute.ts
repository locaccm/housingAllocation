/* eslint-disable jsdoc/check-tag-names */
import { Router, Request, Response } from "express";
import * as leaseController from "../controllers/leaseController";
import { requirePermission } from "../middlewares/requirePermission";
import prisma from "../prisma/client";

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
router.post(
  "/",
  requirePermission("addTenantWithHousing"),
  leaseController.createLease,
);

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
router.put(
  "/:id",
  requirePermission("updateTenantWithHousing"),
  leaseController.updateLease,
);

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
router.delete(
  "/:id",
  requirePermission("deleteTenantWithHousing"),
  leaseController.deleteLease,
);

/**
 * @swagger
 * /lease:
 *   get:
 *     summary: Retrieve all leases
 *     tags: [Lease]
 *     responses:
 *       200:
 *         description: List of leases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   LEAD_START:
 *                     type: string
 *                     format: date
 *                   LEAD_END:
 *                     type: string
 *                     format: date
 *                   LEAN_RENT:
 *                     type: number
 *                   LEAN_CHARGES:
 *                     type: number
 *                   LEAD_PAYMENT:
 *                     type: string
 *                     format: date
 *                   USEN_ID:
 *                     type: integer
 *                   ACCN_ID:
 *                     type: integer
 *       500:
 *         description: Internal server error
 */

router.get(
  "/",
  requirePermission("getLease"),
  async (req: Request, res: Response) => {
    const { userId } = req.query;

    if (!userId || Array.isArray(userId)) {
      res.status(400).json({ error: "Missing or invalid userId" });
      return;
    }

    const userIdNumber = Number(userId);
    if (isNaN(userIdNumber)) {
      res.status(400).json({ error: "Invalid userId format" });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { USEN_ID: userIdNumber },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (user.USEC_TYPE === "TENANT") {
        const leases = await prisma.lease.findMany({
          where: { USEN_ID: user.USEN_ID },
        });
        res.status(200).json(leases);
        return;
      }

      if (user.USEC_TYPE === "OWNER") {
        const accommodations = await prisma.accommodation.findMany({
          where: { USEN_ID: user.USEN_ID },
          select: { ACCN_ID: true },
        });

        const accnIds = accommodations.map((acc) => acc.ACCN_ID);

        const leases = await prisma.lease.findMany({
          where: { ACCN_ID: { in: accnIds } },
        });
        res.status(200).json(leases);
        return;
      }

      res.status(403).json({ error: "Unauthorized user type" });
      return;
    } catch (error) {
      console.error("Error fetching leases:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  },
);

export default router;
