import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "./config/database";
import { logger } from "./config/logger";
import { errorHandler } from "./middleware/errorHandler.middleware";

// Import API routes
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import followUpRoutes from "./routes/followup.routes";
import activityRoutes from "./routes/activity.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import exportRoutes from "./routes/export.routes";

// Load environment variables
dotenv.config();

// Ensure system critical environment configurations are verified
if (!process.env.JWT_SECRET) {
  logger.error("FATAL: JWT_SECRET environment variable is missing!");
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Create Express app instance
const app = express();

// Security headers protection
app.use(helmet());

// CORS protection restricting access to specified frontend domains
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Payload size limit to mitigate DOS risks
app.use(express.json({ limit: "15kb" }));

// Brute-force rate limiting protection
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP. Please try again in 15 minutes.",
  },
});
app.use("/api", apiLimiter);

// Health check and index routes
app.get("/", (req, res) => {
  res.json({ success: true, message: "CRM API is running!" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is healthy",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Bind routers to endpoints
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/followups", followUpRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/export", exportRoutes);

// Catch-all route handler for undefined endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.originalUrl}' not found on this server`,
  });
});

// Register global error handler middleware
app.use(errorHandler);

// Launch server listener
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
});
