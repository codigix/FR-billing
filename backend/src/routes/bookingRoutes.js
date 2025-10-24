import express from "express";
import {
  getAllBookings,
  getBookingById,
  getBookingByConsignment,
  createBooking,
  updateBooking,
  deleteBooking,
  filterBookings,
  updateRate,
  getNoBookingList,
  createMultipleBookings,
  importFromCashCounter,
  importFromText,
  importFromExcelLimitless,
  importFromExcel,
  downloadTemplate,
  getRecycledConsignments,
  searchBookingsWithInvoices,
  upload,
} from "../controllers/bookingController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// ⚠️  IMPORTANT: Specific routes MUST come before generic /:id route!

// Basic GET operations
router.get("/", authenticate, getAllBookings);

// ✅ SPECIFIC ROUTES (must be before /:id)
router.get(
  "/consignment/:consignment_no",
  authenticate,
  getBookingByConsignment
);
router.get("/search-with-invoices", authenticate, searchBookingsWithInvoices);
router.get("/filter", authenticate, filterBookings);
router.get("/no-booking-list", authenticate, getNoBookingList);
router.get("/recycle/list", authenticate, getRecycledConsignments);
router.get("/download-template/:format", downloadTemplate);

// ✅ GENERIC ROUTE (after specific routes)
router.get("/:id", authenticate, getBookingById);

// POST operations
router.post("/", authenticate, createBooking);
router.post("/multiple", authenticate, createMultipleBookings);
router.post("/update-rate", authenticate, updateRate);

// PUT operations
router.put("/:id", authenticate, updateBooking);

// DELETE operations
router.delete("/:id", authenticate, deleteBooking);

// Import operations
router.post("/import-cashcounter", authenticate, importFromCashCounter);
router.post(
  "/import-text",
  authenticate,
  upload.single("file"),
  importFromText
);
router.post(
  "/import-excel-limitless",
  authenticate,
  upload.single("file"),
  importFromExcelLimitless
);
router.post(
  "/import-excel",
  authenticate,
  upload.single("file"),
  importFromExcel
);

export default router;
