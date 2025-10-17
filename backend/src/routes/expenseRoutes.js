import express from "express";
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} from "../controllers/expenseController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getAllExpenses);
router.get("/summary", authenticate, getExpenseSummary);
router.get("/:id", authenticate, getExpenseById);
router.post("/", authenticate, createExpense);
router.put("/:id", authenticate, updateExpense);
router.delete("/:id", authenticate, deleteExpense);

export default router;
