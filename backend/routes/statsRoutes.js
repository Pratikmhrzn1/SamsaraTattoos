import express, { Router } from "express"
import { getStats } from "../controllers/statsController.js"
import {protect} from "../middleware/auth.js";
import {authorize} from "../middleware/authorize.js"

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Admin dashboard statistics
 */
 
/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get dashboard stats (admin)
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Stats fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     bookings:
 *                       type: object
 *                       properties:
 *                         total: { type: integer, example: 24 }
 *                         pending: { type: integer, example: 8 }
 *                         confirmed: { type: integer, example: 14 }
 *                         rejected: { type: integer, example: 2 }
 *                     gallery:
 *                       type: object
 *                       properties:
 *                         total: { type: integer, example: 40 }
 *                     users:
 *                       type: object
 *                       properties:
 *                         total: { type: integer, example: 15 }
 *                 recentBookings:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/",protect,authorize("admin","superadmin"),getStats);
export default router;