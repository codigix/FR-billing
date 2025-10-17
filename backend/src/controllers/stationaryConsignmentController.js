import { getDb } from "../config/database.js";
import multer from "multer";
import XLSX from "xlsx";
import path from "path";

// Get all consignments for franchise
export const getAllConsignments = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const db = getDb();

    const [consignments] = await db.query(
      `SELECT * FROM stationary_consignments 
       WHERE franchise_id = ? 
       ORDER BY receipt_date DESC, id DESC`,
      [franchiseId]
    );

    res.json({
      success: true,
      data: consignments,
    });
  } catch (error) {
    console.error("Get consignments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch consignments",
    });
  }
};

// Get single consignment
export const getConsignmentById = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [[consignment]] = await db.query(
      "SELECT * FROM stationary_consignments WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (!consignment) {
      return res.status(404).json({
        success: false,
        message: "Consignment not found",
      });
    }

    res.json({
      success: true,
      data: consignment,
    });
  } catch (error) {
    console.error("Get consignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch consignment",
    });
  }
};

// Create new consignment
export const createConsignment = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const {
      receipt_date,
      start_no,
      end_no,
      no_of_leafs,
      no_of_books,
      total_consignments,
      used_consignments,
      remaining_consignments,
      type,
    } = req.body;

    const db = getDb();

    const [result] = await db.query(
      `INSERT INTO stationary_consignments 
       (franchise_id, receipt_date, start_no, end_no, no_of_leafs, no_of_books, 
        total_consignments, used_consignments, remaining_consignments, type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        franchiseId,
        receipt_date,
        start_no,
        end_no,
        no_of_leafs || 0,
        no_of_books || 0,
        total_consignments,
        used_consignments || 0,
        remaining_consignments,
        type || "All",
        "active",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Consignment created successfully",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Create consignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create consignment",
    });
  }
};

// Update consignment
export const updateConsignment = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const { used_consignments } = req.body;

    const db = getDb();

    // Get current consignment
    const [[consignment]] = await db.query(
      "SELECT * FROM stationary_consignments WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (!consignment) {
      return res.status(404).json({
        success: false,
        message: "Consignment not found",
      });
    }

    // Calculate remaining
    const remaining = consignment.total_consignments - used_consignments;
    const status = remaining <= 0 ? "depleted" : consignment.status;

    const [result] = await db.query(
      `UPDATE stationary_consignments 
       SET used_consignments = ?, remaining_consignments = ?, status = ?
       WHERE id = ? AND franchise_id = ?`,
      [used_consignments, remaining, status, id, franchiseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Consignment not found",
      });
    }

    res.json({
      success: true,
      message: "Consignment updated successfully",
    });
  } catch (error) {
    console.error("Update consignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update consignment",
    });
  }
};

// Delete consignment
export const deleteConsignment = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [result] = await db.query(
      "DELETE FROM stationary_consignments WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Consignment not found",
      });
    }

    res.json({
      success: true,
      message: "Consignment deleted successfully",
    });
  } catch (error) {
    console.error("Delete consignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete consignment",
    });
  }
};

// Bulk barcode upload handler
export const uploadBulkBarcodes = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Process the barcode data
    // This would typically generate barcodes and store them
    // For now, we'll just return success

    res.json({
      success: true,
      message: `Successfully processed ${data.length} barcode entries`,
      data: {
        count: data.length,
        entries: data,
      },
    });
  } catch (error) {
    console.error("Bulk barcode upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process bulk barcode file",
    });
  }
};

// Generate barcode template
export const generateBarcodeTemplate = async (req, res) => {
  try {
    // Create a simple template
    const templateData = [
      { "Consignment Number": "P0001" },
      { "Consignment Number": "P0002" },
      { "Consignment Number": "P0003" },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Barcodes");

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=barcode_template.xlsx"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Generate template error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate template",
    });
  }
};
