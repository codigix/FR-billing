import express from "express";
import { changePassword } from "../controllers/changePasswordController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/change-password
router.post("/", authenticate, changePassword);

export default router;
