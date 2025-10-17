import { getDb } from "../config/database.js";

// Create cash counter booking
export const createCashBooking = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const bookingData = req.body;

    const db = getDb();

    // Insert booking with new schema
    const sql = `
      INSERT INTO bookings (
        franchise_id, consignment_number, booking_date, customer_id, receiver,
        address, pincode, consignment_type, mode, act_wt, char_wt, qty, type,
        amount, reference, other_charges, status, remarks, dtdc_amt, insurance,
        percentage, risk_surcharge, bill_amount, total, destination
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      franchiseId,
      bookingData.consignment_no,
      bookingData.date,
      bookingData.customer_id || null,
      bookingData.receiver_name || null,
      bookingData.address || null,
      bookingData.pincode || null,
      bookingData.consignment_type || "Domestic",
      bookingData.mode || "AR",
      bookingData.act_wt || 0,
      bookingData.char_wt || 0,
      bookingData.qty || 0,
      bookingData.type || "D",
      bookingData.amount || 0,
      bookingData.reference || null,
      bookingData.other_charges || 0,
      bookingData.status || "Booked",
      bookingData.remarks || null,
      bookingData.dtdc_amt || 0,
      bookingData.insurance || 0,
      bookingData.percentage || 0,
      bookingData.risk_surcharge || 0,
      bookingData.bill_amount || 0,
      bookingData.total || 0,
      bookingData.destination || null,
    ];

    await db.query(sql, params);

    res.json({
      success: true,
      message: "Cash booking created successfully",
      data: { consignment_number: bookingData.consignment_no },
    });
  } catch (error) {
    console.error("Create cash booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create cash booking",
      error: error.message,
    });
  }
};

// Get bookings for bulk print
export const getBulkPrintBookings = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "From and To consignment numbers are required",
      });
    }

    const db = getDb();

    // Get bookings in consignment number range
    const [bookings] = await db.query(
      `SELECT * FROM bookings
       WHERE franchise_id = ? AND consignment_number BETWEEN ? AND ?
       ORDER BY consignment_number ASC`,
      [franchiseId, from, to]
    );

    res.json({
      success: true,
      data: {
        bookings,
        count: bookings.length,
      },
    });
  } catch (error) {
    console.error("Bulk print error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings for bulk print",
    });
  }
};

// Delete cash booking by consignment number
export const deleteCashBooking = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { consignmentNo } = req.params;

    if (!consignmentNo) {
      return res.status(400).json({
        success: false,
        message: "Consignment number is required",
      });
    }

    const db = getDb();

    // Check if booking exists
    const [bookings] = await db.query(
      `SELECT * FROM bookings WHERE franchise_id = ? AND consignment_number = ?`,
      [franchiseId, consignmentNo]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking is already billed/invoiced
    const [invoices] = await db.query(
      `SELECT * FROM invoices WHERE franchise_id = ? AND FIND_IN_SET(?, consignment_no)`,
      [franchiseId, consignmentNo]
    );

    if (invoices.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete booking. This consignment has already been invoiced.",
      });
    }

    // Delete booking
    await db.query(
      `DELETE FROM bookings WHERE franchise_id = ? AND consignment_number = ?`,
      [franchiseId, consignmentNo]
    );

    res.json({
      success: true,
      message: "Cash booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete cash booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete cash booking",
    });
  }
};

// Get single booking by consignment number (for print receipt)
export const getBookingByConsignment = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { consignmentNo } = req.params;

    const db = getDb();

    const [bookings] = await db.query(
      `SELECT * FROM bookings WHERE franchise_id = ? AND consignment_number = ?`,
      [franchiseId, consignmentNo]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: { booking: bookings[0] },
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};
