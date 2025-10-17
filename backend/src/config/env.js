import dotenv from "dotenv";

// Load environment variables from .env file when available
dotenv.config();

const {
  NODE_ENV = "development",
  PORT = 5000,
  MYSQL_HOST = "localhost",
  MYSQL_PORT = 3306,
  MYSQL_USER = "root",
  MYSQL_PASSWORD = "Backend",
  MYSQL_DATABASE = "frbilling",
  JWT_SECRET = "change_me",
  JWT_EXPIRATION = "1d",
  CORS_ORIGIN = "http://localhost:3000",
} = process.env;

export const env = {
  nodeEnv: NODE_ENV,
  port: Number(PORT),
  mysql: {
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
  },
  jwtSecret: JWT_SECRET,
  jwtExpiration: JWT_EXPIRATION,
  corsOrigin: CORS_ORIGIN,
};
