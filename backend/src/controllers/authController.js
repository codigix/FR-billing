import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../config/database.js";
import { env } from "../config/env.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const db = getDb();

    // Find user with franchise information
    const [users] = await db.query(
      `SELECT u.*, f.franchise_code, f.franchise_name, f.subscription_status, f.subscription_end_date
       FROM users u
       JOIN franchises f ON u.franchise_id = f.id
       WHERE u.username = ? AND u.status = 'active'`,
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    await db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [
      user.id,
    ]);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        franchiseId: user.franchise_id,
      },
      env.jwtSecret,
      { expiresIn: env.jwtExpiration }
    );

    // Remove password from response
    delete user.password;

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = { ...req.user };
    delete user.password;

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user information",
    });
  }
};

export const logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logout successful",
  });
};
