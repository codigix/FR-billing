import { getDb } from "../config/database.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFranchiseFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'logo', 'stamp', or 'qr_code'

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (!["logo", "stamp", "qr_code"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type",
      });
    }

    const db = getDb();

    // Check if franchise exists
    const [franchises] = await db.query(
      "SELECT id FROM franchises WHERE id = ?",
      [id]
    );

    if (franchises.length === 0) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    // Build the URL path
    const fileUrl = `/uploads/${req.file.filename}`;

    // Update franchise with file URL
    const columnName = `${type}_url`;
    await db.query(`UPDATE franchises SET ${columnName} = ? WHERE id = ?`, [
      fileUrl,
      id,
    ]);

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: { url: fileUrl },
    });
  } catch (error) {
    console.error("Upload error:", error);
    // Clean up file if there was an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Failed to upload file",
    });
  }
};

export const removeFranchiseFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!["logo", "stamp", "qr_code"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type",
      });
    }

    const db = getDb();

    // Get current file URL
    const columnName = `${type}_url`;
    const [franchises] = await db.query(
      `SELECT ${columnName} as file_url FROM franchises WHERE id = ?`,
      [id]
    );

    if (franchises.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    const fileUrl = franchises[0].file_url;

    // Delete file from filesystem if it exists
    if (fileUrl) {
      const uploadsDir = path.join(__dirname, "../../uploads");
      const filename = path.basename(fileUrl);
      const filePath = path.join(uploadsDir, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Update database to remove URL
    await db.query(`UPDATE franchises SET ${columnName} = NULL WHERE id = ?`, [
      id,
    ]);

    res.json({
      success: true,
      message: "File removed successfully",
    });
  } catch (error) {
    console.error("Remove file error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove file",
    });
  }
};
