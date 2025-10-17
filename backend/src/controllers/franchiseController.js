import { getDb } from "../config/database.js";

// Get all franchises with pagination and search
export const getAllFranchises = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (page - 1) * limit;

    const db = getDb();
    let whereClause = "WHERE 1=1";
    const params = [];

    if (status) {
      whereClause += " AND status = ?";
      params.push(status);
    }

    if (search) {
      whereClause +=
        " AND (franchise_code LIKE ? OR franchise_name LIKE ? OR owner_name LIKE ? OR email LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM franchises ${whereClause}`,
      params
    );

    // Get franchises
    const [franchises] = await db.query(
      `SELECT * FROM franchises ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: {
        franchises,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(countResult[0].total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get franchises error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch franchises",
    });
  }
};

// Get franchise by ID
export const getFranchiseById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const [franchises] = await db.query(
      "SELECT * FROM franchises WHERE id = ?",
      [id]
    );

    if (franchises.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    // Get franchise statistics
    const [stats] = await db.query(
      `SELECT 
        COUNT(DISTINCT b.id) as total_bookings,
        COUNT(DISTINCT i.id) as total_invoices,
        COALESCE(SUM(b.amount), 0) as total_booking_amount,
        COALESCE(SUM(i.total_amount), 0) as total_invoice_amount
       FROM franchises f
       LEFT JOIN bookings b ON f.id = b.franchise_id
       LEFT JOIN invoices i ON f.id = i.franchise_id
       WHERE f.id = ?
       GROUP BY f.id`,
      [id]
    );

    res.json({
      success: true,
      data: {
        franchise: franchises[0],
        statistics: stats[0] || {
          total_bookings: 0,
          total_invoices: 0,
          total_booking_amount: 0,
          total_invoice_amount: 0,
        },
      },
    });
  } catch (error) {
    console.error("Get franchise error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch franchise",
    });
  }
};

// Create new franchise
export const createFranchise = async (req, res) => {
  try {
    const franchiseData = req.body;
    const db = getDb();

    // Check if franchise code already exists
    const [existing] = await db.query(
      "SELECT id FROM franchises WHERE franchise_code = ?",
      [franchiseData.franchise_code]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Franchise code already exists",
      });
    }

    // Check if email already exists
    const [existingEmail] = await db.query(
      "SELECT id FROM franchises WHERE email = ?",
      [franchiseData.email]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const [result] = await db.query("INSERT INTO franchises SET ?", [
      franchiseData,
    ]);

    res.status(201).json({
      success: true,
      message: "Franchise created successfully",
      data: {
        id: result.insertId,
      },
    });
  } catch (error) {
    console.error("Create franchise error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create franchise",
    });
  }
};

// Update franchise
export const updateFranchise = async (req, res) => {
  try {
    const { id } = req.params;
    const franchiseData = req.body;
    const db = getDb();

    // Check if franchise exists
    const [existing] = await db.query("SELECT * FROM franchises WHERE id = ?", [
      id,
    ]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    // Check if franchise code is being changed and already exists
    if (
      franchiseData.franchise_code &&
      franchiseData.franchise_code !== existing[0].franchise_code
    ) {
      const [codeExists] = await db.query(
        "SELECT id FROM franchises WHERE franchise_code = ? AND id != ?",
        [franchiseData.franchise_code, id]
      );

      if (codeExists.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Franchise code already exists",
        });
      }
    }

    // Check if email is being changed and already exists
    if (franchiseData.email && franchiseData.email !== existing[0].email) {
      const [emailExists] = await db.query(
        "SELECT id FROM franchises WHERE email = ? AND id != ?",
        [franchiseData.email, id]
      );

      if (emailExists.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    await db.query("UPDATE franchises SET ?, updated_at = NOW() WHERE id = ?", [
      franchiseData,
      id,
    ]);

    res.json({
      success: true,
      message: "Franchise updated successfully",
    });
  } catch (error) {
    console.error("Update franchise error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update franchise",
    });
  }
};

// Delete franchise
export const deleteFranchise = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();

    // Check if franchise has bookings or invoices
    const [bookings] = await db.query(
      "SELECT COUNT(*) as count FROM bookings WHERE franchise_id = ?",
      [id]
    );

    if (bookings[0].count > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete franchise with existing bookings. Please delete all bookings first.",
      });
    }

    const [result] = await db.query("DELETE FROM franchises WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    res.json({
      success: true,
      message: "Franchise deleted successfully",
    });
  } catch (error) {
    console.error("Delete franchise error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete franchise",
    });
  }
};

// Toggle franchise status
export const toggleFranchiseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = getDb();

    if (!["active", "inactive", "suspended"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const [result] = await db.query(
      "UPDATE franchises SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    res.json({
      success: true,
      message: "Franchise status updated successfully",
    });
  } catch (error) {
    console.error("Toggle franchise status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update franchise status",
    });
  }
};
