import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { getDb } from "../config/database.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, env.jwtSecret);

      // Fetch user from database
      const db = getDb();
      const [users] = await db.query(
        `SELECT u.*, f.franchise_code, f.franchise_name, f.subscription_status, f.subscription_end_date
         FROM users u
         JOIN franchises f ON u.franchise_id = f.id
         WHERE u.id = ? AND u.status = 'active'`,
        [decoded.userId]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: "User not found or inactive",
        });
      }

      // Attach user to request object
      req.user = users[0];
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};
