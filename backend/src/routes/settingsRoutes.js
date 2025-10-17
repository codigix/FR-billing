import express from "express";
import {
  getSettings,
  updateSettings,
  getInvoiceDataColumns,
} from "../controllers/settingsController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Get invoice data columns options
router.get("/columns", authenticate, getInvoiceDataColumns);

// Get franchise settings
router.get("/", authenticate, getSettings);

// Update franchise settings
router.post("/", authenticate, updateSettings);

export default router;
