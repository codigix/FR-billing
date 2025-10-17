import mysql from "mysql2/promise";
import { env } from "./env.js";

let pool;

export const connectDatabase = async () => {
  if (pool) {
    return pool;
  }

  try {
    pool = mysql.createPool({
      host: env.mysql.host,
      port: env.mysql.port,
      user: env.mysql.user,
      password: env.mysql.password,
      database: env.mysql.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Verify the connection
    await pool.query("SELECT 1");
    console.log("✅ MySQL connected");
    return pool;
  } catch (error) {
    console.error("❌ MySQL connection error:", error.message);
    process.exit(1);
  }
};

export const getDb = () => {
  if (!pool) {
    throw new Error(
      "Database pool has not been initialized. Call connectDatabase() first."
    );
  }
  return pool;
};
