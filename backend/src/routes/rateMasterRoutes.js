import express from "express";
import multer from "multer";
import {
  getAllRates,
  getRateById,
  calculateRate,
  createRate,
  updateRate,
  deleteRate,
} from "../controllers/rateMasterController.js";
import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  uploadCompaniesFromExcel,
  generateCompanyTemplate,
} from "../controllers/companyRateMasterController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/temp/" });

// ⚠️ IMPORTANT: Specific routes MUST come before parameterized routes

// Company Excel import/export routes (most specific)
router.post(
  "/company/import-excel",
  authenticate,
  upload.single("file"),
  uploadCompaniesFromExcel
);
router.get("/company/export-template", authenticate, generateCompanyTemplate);

// Company management routes
router.get("/company", authenticate, getAllCompanies);
router.post("/company", authenticate, createCompany);
router.get("/company/:id", authenticate, getCompanyById);
router.put("/company/:id", authenticate, updateCompany);
router.delete("/company/:id", authenticate, deleteCompany);

// Rate calculation (specific route)
router.post("/calculate", authenticate, calculateRate);

// Original rate master routes (generic - must come last)
router.get("/", authenticate, getAllRates);
router.post("/", authenticate, createRate);
router.get("/:id", authenticate, getRateById);
router.put("/:id", authenticate, updateRate);
router.delete("/:id", authenticate, deleteRate);

export default router;
