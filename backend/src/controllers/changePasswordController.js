import bcrypt from "bcryptjs";
import { getDb } from "../config/database.js";

// Change password endpoint
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from old password",
      });
    }

    const db = getDb();

    // Get current user password
    const [users] = await db.query(
      "SELECT id, password FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      userId,
    ]);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};
