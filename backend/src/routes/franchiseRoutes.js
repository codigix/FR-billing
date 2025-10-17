import express from "express";
import {
  getAllFranchises,
  getFranchiseById,
  createFranchise,
  updateFranchise,
  deleteFranchise,
  toggleFranchiseStatus,
} from "../controllers/franchiseController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get("/", getAllFranchises);
router.get("/:id", getFranchiseById);
router.post("/", createFranchise);
router.put("/:id", updateFranchise);
router.delete("/:id", deleteFranchise);
router.patch("/:id/status", toggleFranchiseStatus);

export default router;
