import express from "express";
import {
  getAllImages,
  uploadImage,
  deleteImage,
} from "../controllers/galleryController.js";
import { protect } from "../middleware/auth.js";
import { authorize, ROLE } from "../middleware/authorize.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: Gallery image management
 */

/**
 * @swagger
 * /api/gallery:
 *   get:
 *     summary: Get all gallery images
 *     tags: [Gallery]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: style
 *         schema:
 *           type: string
 *           enum: [full sleeve tattoo,custom tattoo,paintings,achievements,others]
 *         description: Filter by tattoo style
 *     responses:
 *       200:
 *         description: List of gallery images
 */
router.get("/", getAllImages);

/**
 * @swagger
 * /api/gallery:
 *   post:
 *     summary: Upload a gallery image (admin)
 *     tags: [Gallery]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               style:
 *                 type: string
 *                 enum: [full sleeve tattoo,custom tattoo,paintings,achievements,others]
 *               artistName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Image uploaded
 *       400:
 *         description: No image provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", protect, authorize(ROLE.ADMIN,ROLE.SUPERADMIN), upload.single("image"), uploadImage);

/**
 * @swagger
 * /api/gallery/{id}:
 *   delete:
 *     summary: Delete a gallery image (admin)
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image deleted
 *       404:
 *         description: Image not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", protect, authorize(ROLE.ADMIN,ROLE.SUPERADMIN), deleteImage);

export default router;