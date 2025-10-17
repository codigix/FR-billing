import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import apiRoutes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Core middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API routes
app.use("/api", apiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port}`);
  });
};

startServer();
