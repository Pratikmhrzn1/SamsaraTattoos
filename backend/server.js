import express from "express";

import dotenv from "dotenv";

import connectDB from "./config/database.js";

import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from './routes/bookingRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import log from "./utils/logger.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

/**
 * Enabling access of variables in .env file
 */
dotenv.config();

/**
 * Connection to database i.e MongoDB
 */
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Route to users
 */
app.use("/api/users", userRoutes);
/**
 * Route to bookings
 */
app.use('/api/bookings',bookingRoutes);
/**
 * Route to gallery
 */
app.use("/api/gallery", galleryRoutes);
/**
 * Error handlers for the api
 */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  log("info", `Server running on port ${PORT}`);
  /**
   * Log to provide the link of swagger docs
   */
  log("info", `Swagger server is running in http://localhost:${PORT}/api-docs`);
});
