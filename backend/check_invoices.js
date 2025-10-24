import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Backend",
  database: "frbilling",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function checkInvoices() {
  try {
    const connection = await pool.getConnection();

    console.log("\n📋 Checking invoices in database...\n");

    const [invoices] = await connection.query(
      "SELECT id, invoice_number, customer_id, invoice_date, total_amount FROM invoices ORDER BY id DESC LIMIT 10"
    );

    if (invoices.length === 0) {
      console.log("❌ No invoices found in database!");
    } else {
      console.log(
        `✅ Found ${invoices.length} invoices (showing latest 10):\n`
      );
      invoices.forEach((inv, idx) => {
        console.log(`${idx + 1}. Invoice #: ${inv.invoice_number}`);
        console.log(`   ID: ${inv.id}, Customer: ${inv.customer_id}`);
        console.log(
          `   Date: ${inv.invoice_date}, Amount: ₹${inv.total_amount}`
        );
        console.log();
      });
    }

    connection.release();
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await pool.end();
  }
}

checkInvoices();
