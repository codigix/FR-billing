import { getDb } from "../config/database.js";

export const getAllExpenses = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { page = 1, limit = 20, category, date_from, date_to } = req.query;
    const offset = (page - 1) * limit;

    const db = getDb();
    let whereClause = "WHERE franchise_id = ?";
    const params = [franchiseId];

    if (category) {
      whereClause += " AND category = ?";
      params.push(category);
    }

    if (date_from) {
      whereClause += " AND expense_date >= ?";
      params.push(date_from);
    }

    if (date_to) {
      whereClause += " AND expense_date <= ?";
      params.push(date_to);
    }

    const [expenses] = await db.query(
      `SELECT * FROM expenses 
       ${whereClause}
       ORDER BY expense_date DESC, created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM expenses ${whereClause}`,
      params
    );

    const [[{ total_amount }]] = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total_amount FROM expenses ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: expenses,
      summary: {
        total_amount,
      },
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch expenses" });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [[expense]] = await db.query(
      "SELECT * FROM expenses WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    console.error("Get expense error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch expense" });
  }
};

export const createExpense = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const userId = req.user.id;
    const {
      category,
      description,
      amount,
      expense_date,
      payment_mode,
      bill_number,
    } = req.body;
    const db = getDb();

    const [result] = await db.query(
      `INSERT INTO expenses 
       (franchise_id, user_id, category, description, amount, expense_date, payment_mode, bill_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        franchiseId,
        userId,
        category,
        description,
        amount,
        expense_date || new Date().toISOString().split("T")[0],
        payment_mode || "cash",
        bill_number,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Create expense error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create expense" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const {
      category,
      description,
      amount,
      expense_date,
      payment_mode,
      bill_number,
    } = req.body;
    const db = getDb();

    const [result] = await db.query(
      `UPDATE expenses 
       SET category = ?, description = ?, amount = ?, expense_date = ?, payment_mode = ?, bill_number = ?
       WHERE id = ? AND franchise_id = ?`,
      [
        category,
        description,
        amount,
        expense_date,
        payment_mode,
        bill_number,
        id,
        franchiseId,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    res.json({ success: true, message: "Expense updated successfully" });
  } catch (error) {
    console.error("Update expense error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update expense" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [result] = await db.query(
      "DELETE FROM expenses WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete expense" });
  }
};

export const getExpenseSummary = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { date_from, date_to } = req.query;
    const db = getDb();

    let whereClause = "WHERE franchise_id = ?";
    const params = [franchiseId];

    if (date_from) {
      whereClause += " AND expense_date >= ?";
      params.push(date_from);
    }

    if (date_to) {
      whereClause += " AND expense_date <= ?";
      params.push(date_to);
    }

    const [byCategory] = await db.query(
      `SELECT category, COUNT(*) as count, SUM(amount) as total_amount
       FROM expenses
       ${whereClause}
       GROUP BY category
       ORDER BY total_amount DESC`,
      params
    );

    const [byPaymentMode] = await db.query(
      `SELECT payment_mode, COUNT(*) as count, SUM(amount) as total_amount
       FROM expenses
       ${whereClause}
       GROUP BY payment_mode
       ORDER BY total_amount DESC`,
      params
    );

    res.json({
      success: true,
      data: {
        by_category: byCategory,
        by_payment_mode: byPaymentMode,
      },
    });
  } catch (error) {
    console.error("Get expense summary error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch expense summary" });
  }
};
