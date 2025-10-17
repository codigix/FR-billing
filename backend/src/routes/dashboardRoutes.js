import express from "express";
import {
  getDashboardStats,
  getRevenueTrends,
  getPaymentAnalytics,
} from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", authenticate, getDashboardStats);
router.get("/revenue-trends", authenticate, getRevenueTrends);
router.get("/payment-analytics", authenticate, getPaymentAnalytics);

export default router;
