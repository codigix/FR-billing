import express from "express";
import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import franchiseRoutes from "./franchiseRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import invoiceRoutes from "./invoiceRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import rateMasterRoutes from "./rateMasterRoutes.js";
import stationaryRoutes from "./stationaryRoutes.js";
import trackingRoutes from "./trackingRoutes.js";
import expenseRoutes from "./expenseRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import sectorRoutes from "./sectorRoutes.js";
import reportsRoutes from "./reportsRoutes.js";
import cashcounterRoutes from "./cashcounterRoutes.js";
import settingsRoutes from "./settingsRoutes.js";
import chatbotRoutes from "./chatbotRoutes.js";

const router = express.Router();

// API Routes
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/franchises", franchiseRoutes);
router.use("/bookings", bookingRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/payments", paymentRoutes);
router.use("/rates", rateMasterRoutes);
router.use("/stationary", stationaryRoutes);
router.use("/tracking", trackingRoutes);
router.use("/expenses", expenseRoutes);
router.use("/uploads", uploadRoutes);
router.use("/sectors", sectorRoutes);
router.use("/reports", reportsRoutes);
router.use("/cashcounter", cashcounterRoutes);
router.use("/settings", settingsRoutes);
router.use("/chatbot", chatbotRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
