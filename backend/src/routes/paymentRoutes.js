import express from "express";
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getInvoiceSummary,
  getInvoiceList,
  getPaymentTrack,
  getCustomerCredit,
  getConsignmentReport,
} from "../controllers/paymentController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Payment module specific routes (must come before /:id)
router.get("/invoice-summary", authenticate, getInvoiceSummary);
router.get("/invoice-list", authenticate, getInvoiceList);
router.get("/track", authenticate, getPaymentTrack);
router.get("/customer-credit", authenticate, getCustomerCredit);
router.get("/consignment-report", authenticate, getConsignmentReport);

// Payment CRUD routes
router.get("/", authenticate, getAllPayments);
router.get("/:id", authenticate, getPaymentById);
router.post("/", authenticate, createPayment);
router.put("/:id", authenticate, updatePayment);
router.delete("/:id", authenticate, deletePayment);

export default router;
