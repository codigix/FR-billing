import mysql from "mysql2/promise";

async function getData() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Backend",
    database: "frbilling",
  });

  try {
    const [rows] = await conn.query(
      "SELECT consignment_number, customer_id, receiver, destination, act_wt, qty, mode, amount, total, status, booking_date, remarks FROM bookings LIMIT 10"
    );

    console.log(
      "\n================== FULL BOOKING DETAILS ==================\n"
    );

    rows.forEach((row, idx) => {
      console.log(`\nBooking #${idx + 1}:`);
      console.log("─".repeat(60));
      console.log(`  📌 Consignment No:    ${row.consignment_number}`);
      console.log(`  👤 Customer ID:       ${row.customer_id || "N/A"}`);
      console.log(`  📞 Receiver:          ${row.receiver || "N/A"}`);
      console.log(`  📍 Destination:       ${row.destination || "N/A"}`);
      console.log(`  📦 Weight (kg):       ${row.act_wt || "N/A"}`);
      console.log(`  📦 Quantity:          ${row.qty || "N/A"}`);
      console.log(`  ✈️  Mode:              ${row.mode || "N/A"}`);
      console.log(`  💰 Amount:            ₹${row.amount || "0.00"}`);
      console.log(`  💳 Total:             ₹${row.total || "0.00"}`);
      console.log(`  🔴 Status:            ${row.status || "N/A"}`);
      console.log(
        `  📅 Booking Date:      ${
          row.booking_date ? new Date(row.booking_date).toDateString() : "N/A"
        }`
      );
      console.log(`  📝 Remarks:           ${row.remarks || "N/A"}`);
    });

    console.log("\n" + "=".repeat(60) + "\n");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await conn.end();
  }
}

getData();
