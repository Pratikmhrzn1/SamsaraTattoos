import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Submit a booking request
 *     tags: [Bookings]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [firstName, email, phoneNumber, date, tattooIdea]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Pratik
 *               lastName:
 *                 type: string
 *                 example: Maharjan
 *               email:
 *                 type: string
 *                 example: pratik@gmail.com
 *               phoneNumber:
 *                 type: string
 *                 example: "9812345678"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-10"
 *               tattooIdea:
 *                 type: string
 *                 example: A dragon on my forearm
 *               referenceImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Booking submitted
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", upload.single("referenceImage"), createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings (admin)
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, rejected]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of bookings
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
router.get("/", protect, authorize("admin","superadmin"), getAllBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get single booking (admin)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a7f9c2e4b0d5a1f8c3e2b1
 *     responses:
 *       200:
 *         description: Booking found
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", protect, authorize("admin","superadmin"), getBookingById);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Update booking status (admin)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, rejected]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated
 *       400:
 *         description: Invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/status", protect, authorize("admin","superadmin"), updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete a booking (admin)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", protect, authorize("admin","superadmin"), deleteBooking);

export default router;