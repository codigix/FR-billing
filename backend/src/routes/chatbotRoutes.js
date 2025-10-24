import express from "express";
import {
  chatWithAssistant,
  getConsignmentForChat,
} from "../controllers/chatbotController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Chat endpoint - main conversational interface
router.post("/chat", authenticate, chatWithAssistant);

// Get consignment details for chat
router.get("/:consignmentNo", authenticate, getConsignmentForChat);

export default router;
