import express from "express";
import {
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  generateInvoice,
  generateMultipleInvoices,
  generateSingleInvoice,
  generateInvoiceWithoutGST,
  getInvoiceSummary,
  getSingleInvoiceSummary,
  getRecycledInvoices,
  downloadInvoice,
} from "../controllers/invoiceController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Get routes
router.get("/", authenticate, getAllInvoices);
router.get("/summary", authenticate, getInvoiceSummary);
router.get("/single-summary", authenticate, getSingleInvoiceSummary);
router.get("/recycle/list", authenticate, getRecycledInvoices);
router.get("/download/:file", authenticate, downloadInvoice); // Download invoice file by filename
router.get("/:id/download", authenticate, downloadInvoice); // Download invoice as HTML by ID
router.get("/:id", authenticate, getInvoiceById);

// Generate/Create routes
router.post("/generate", authenticate, generateInvoice);
router.post("/generate-multiple", authenticate, generateMultipleInvoices);
router.post("/generate-single", authenticate, generateSingleInvoice);
router.post("/generate-without-gst", authenticate, generateInvoiceWithoutGST);

// Update and delete routes
router.put("/:id", authenticate, updateInvoice);
router.delete("/:id", authenticate, deleteInvoice);

export default router;
