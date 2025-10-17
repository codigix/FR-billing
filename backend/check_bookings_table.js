import mysql from "mysql2/promise";

async function checkBookingsTable() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Backend",
    database: "frbilling",
  });

  const [rows] = await conn.query("DESCRIBE bookings");
  console.log("Current bookings table structure:");
  console.table(rows);

  await conn.end();
}

checkBookingsTable().catch(console.error);
