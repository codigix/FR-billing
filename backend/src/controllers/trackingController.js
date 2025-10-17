import { getDb } from "../config/database.js";

export const getTrackingByBooking = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { booking_id } = req.params;
    const db = getDb();

    // Verify booking belongs to franchise
    const [[booking]] = await db.query(
      "SELECT id FROM bookings WHERE id = ? AND franchise_id = ?",
      [booking_id, franchiseId]
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const [tracking] = await db.query(
      "SELECT * FROM tracking WHERE booking_id = ? ORDER BY status_date DESC, created_at DESC",
      [booking_id]
    );

    res.json({ success: true, data: tracking });
  } catch (error) {
    console.error("Get tracking error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch tracking history" });
  }
};

export const getTrackingByConsignment = async (req, res) => {
  try {
    const { consignment_number } = req.params;
    const db = getDb();

    // Get booking by consignment number
    const [[booking]] = await db.query(
      "SELECT id, franchise_id, booking_number, consignment_number, sender_name, receiver_name FROM bookings WHERE consignment_number = ?",
      [consignment_number]
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Consignment not found" });
    }

    const [tracking] = await db.query(
      "SELECT * FROM tracking WHERE booking_id = ? ORDER BY status_date DESC, created_at DESC",
      [booking.id]
    );

    res.json({
      success: true,
      data: {
        booking: {
          booking_number: booking.booking_number,
          consignment_number: booking.consignment_number,
          sender_name: booking.sender_name,
          receiver_name: booking.receiver_name,
        },
        tracking,
      },
    });
  } catch (error) {
    console.error("Get tracking error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch tracking history" });
  }
};

export const createTracking = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { booking_id, status, location, remarks, status_date } = req.body;
    const db = getDb();

    // Verify booking belongs to franchise
    const [[booking]] = await db.query(
      "SELECT id FROM bookings WHERE id = ? AND franchise_id = ?",
      [booking_id, franchiseId]
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const [result] = await db.query(
      `INSERT INTO tracking (booking_id, status, location, remarks, status_date)
       VALUES (?, ?, ?, ?, ?)`,
      [booking_id, status, location, remarks, status_date || new Date()]
    );

    // Update booking status
    await db.query("UPDATE bookings SET status = ? WHERE id = ?", [
      status,
      booking_id,
    ]);

    res.status(201).json({
      success: true,
      message: "Tracking entry created successfully",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Create tracking error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create tracking entry" });
  }
};

export const updateTracking = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const { status, location, remarks, status_date } = req.body;
    const db = getDb();

    // Verify tracking belongs to franchise through booking
    const [[tracking]] = await db.query(
      `SELECT t.id, t.booking_id 
       FROM tracking t
       JOIN bookings b ON t.booking_id = b.id
       WHERE t.id = ? AND b.franchise_id = ?`,
      [id, franchiseId]
    );

    if (!tracking) {
      return res
        .status(404)
        .json({ success: false, message: "Tracking entry not found" });
    }

    const [result] = await db.query(
      `UPDATE tracking 
       SET status = ?, location = ?, remarks = ?, status_date = ?
       WHERE id = ?`,
      [status, location, remarks, status_date, id]
    );

    res.json({ success: true, message: "Tracking entry updated successfully" });
  } catch (error) {
    console.error("Update tracking error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update tracking entry" });
  }
};

export const deleteTracking = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    // Verify tracking belongs to franchise through booking
    const [[tracking]] = await db.query(
      `SELECT t.id 
       FROM tracking t
       JOIN bookings b ON t.booking_id = b.id
       WHERE t.id = ? AND b.franchise_id = ?`,
      [id, franchiseId]
    );

    if (!tracking) {
      return res
        .status(404)
        .json({ success: false, message: "Tracking entry not found" });
    }

    const [result] = await db.query("DELETE FROM tracking WHERE id = ?", [id]);

    res.json({ success: true, message: "Tracking entry deleted successfully" });
  } catch (error) {
    console.error("Delete tracking error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete tracking entry" });
  }
};
