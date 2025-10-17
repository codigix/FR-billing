import express from "express";
import multer from "multer";
import {
  getAllStationary,
  getStationaryById,
  createStationary,
  updateStationary,
  deleteStationary,
  adjustStock,
} from "../controllers/stationaryController.js";
import {
  getAllConsignments,
  getConsignmentById,
  createConsignment,
  updateConsignment,
  deleteConsignment,
  uploadBulkBarcodes,
  generateBarcodeTemplate,
} from "../controllers/stationaryConsignmentController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/temp/" });

// ⚠️ IMPORTANT: Specific routes MUST come before parameterized routes
// Otherwise /:id will catch /consignments and /bulk-barcode

// Bulk barcode routes (most specific)
router.post(
  "/bulk-barcode/upload",
  authenticate,
  upload.single("file"),
  uploadBulkBarcodes
);
router.get("/bulk-barcode/template", authenticate, generateBarcodeTemplate);

// Consignment routes (specific paths)
router.get("/consignments", authenticate, getAllConsignments);
router.post("/consignments", authenticate, createConsignment);
router.get("/consignments/:id", authenticate, getConsignmentById);
router.put("/consignments/:id", authenticate, updateConsignment);
router.delete("/consignments/:id", authenticate, deleteConsignment);

// Original stationary routes (with :id parameter - must come last)
router.get("/", authenticate, getAllStationary);
router.post("/", authenticate, createStationary);
router.get("/:id", authenticate, getStationaryById);
router.put("/:id", authenticate, updateStationary);
router.delete("/:id", authenticate, deleteStationary);
router.post("/:id/adjust", authenticate, adjustStock);

export default router;
