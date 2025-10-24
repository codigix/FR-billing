require("dotenv").config();
const mysql = require("mysql2/promise");

async function checkData() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "Backend",
    database: process.env.MYSQL_DATABASE || "frbilling",
  });

  try {
    console.log("=== BOOKINGS COUNT ===");
    const [bookings] = await connection.query(
      "SELECT COUNT(*) as total FROM bookings"
    );
    console.log(`Total Bookings: ${bookings[0].total}`);

    console.log("\n=== RECENT 10 BOOKINGS ===");
    const [recentBookings] = await connection.query(`
      SELECT 
        id,
        consignment_number,
        invoice_id,
        created_at
      FROM bookings
      ORDER BY created_at DESC
      LIMIT 10
    `);
    console.table(recentBookings);

    console.log("\n=== INVOICES COUNT ===");
    const [invoices] = await connection.query(
      "SELECT COUNT(*) as total FROM invoices"
    );
    console.log(`Total Invoices: ${invoices[0].total}`);

    console.log("\n=== RECENT 10 INVOICES ===");
    const [recentInvoices] = await connection.query(`
      SELECT 
        id,
        invoice_number,
        franchise_id,
        created_at
      FROM invoices
      ORDER BY created_at DESC
      LIMIT 10
    `);
    console.table(recentInvoices);

    console.log("\n=== BOOKINGS PER INVOICE ===");
    const [bookingsPerInvoice] = await connection.query(`
      SELECT 
        ii.invoice_id,
        COUNT(DISTINCT b.id) as booking_count,
        GROUP_CONCAT(DISTINCT b.consignment_number) as consignments
      FROM invoice_items ii
      LEFT JOIN bookings b ON ii.booking_id = b.id
      GROUP BY ii.invoice_id
      ORDER BY ii.invoice_id DESC
      LIMIT 10
    `);
    console.table(bookingsPerInvoice);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await connection.end();
  }
}

checkData();
