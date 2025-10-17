const path = require("node:path");
require("dotenv").config();

const backendRoot = __dirname;

module.exports = {
  client: "mysql2",
  connection: {
    host: process.env.MYSQL_HOST || "localhost",
    port: parseInt(process.env.MYSQL_PORT || "3306", 10),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "Backend",
    database: process.env.MYSQL_DATABASE || "frbilling",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: path.join(backendRoot, "migrations"),
  },
  seeds: {
    directory: path.join(backendRoot, "seeds"),
  },
};
