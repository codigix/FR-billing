import express from "express";
import {
  getCreditorsReport,
  getSaleReportBeforeInvoice,
  getTaxReport,
  getBilledUnbilledList,
  getBusinessAnalysis,
  getCustomerSalesComparison,
  getCashSalesReport,
  getCashDailyReport,
  getCashCreditorsReport,
} from "../controllers/reportsController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Billing Reports routes
router.get("/creditors", getCreditorsReport);
router.get("/sale-before-invoice", getSaleReportBeforeInvoice);
router.get("/tax-report", getTaxReport);
router.get("/billed-unbilled", getBilledUnbilledList);
router.get("/business-analysis", getBusinessAnalysis);
router.get("/customer-sales-comparison", getCustomerSalesComparison);

// Cashcounter Reports routes
router.get("/sales-report", getCashSalesReport);
router.get("/daily-report", getCashDailyReport);
router.get("/creditors-report", getCashCreditorsReport);

export default router;
