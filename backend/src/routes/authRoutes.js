import express from "express";
import {
  login,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import { changePassword } from "../controllers/changePasswordController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", authenticate, logout);
router.post("/change-password", authenticate, changePassword);

export default router;
