import express from "express";
import {
  createCashBooking,
  getBulkPrintBookings,
  deleteCashBooking,
  getBookingByConsignment,
} from "../controllers/cashcounterController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create cash booking (Print Receipt)
router.post("/create-booking", createCashBooking);

// Get bookings for bulk print
router.get("/bulk-print", getBulkPrintBookings);

// Get single booking by consignment number
router.get("/booking/:consignmentNo", getBookingByConsignment);

// Delete cash booking
router.delete("/delete-booking/:consignmentNo", deleteCashBooking);

export default router;
