import express from "express";
import {
  getTrackingByBooking,
  getTrackingByConsignment,
  createTracking,
  updateTracking,
  deleteTracking,
} from "../controllers/trackingController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/booking/:booking_id", authenticate, getTrackingByBooking);
router.get("/consignment/:consignment_number", getTrackingByConsignment); // Public endpoint
router.post("/", authenticate, createTracking);
router.put("/:id", authenticate, updateTracking);
router.delete("/:id", authenticate, deleteTracking);

export default router;
