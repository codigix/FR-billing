import { getDb } from "../config/database.js";

export const getAllPayments = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const {
      page = 1,
      limit = 20,
      payment_mode,
      date_from,
      date_to,
    } = req.query;
    const offset = (page - 1) * limit;

    const db = getDb();
    let whereClause = "WHERE p.franchise_id = ?";
    const params = [franchiseId];

    if (payment_mode) {
      whereClause += " AND p.payment_mode = ?";
      params.push(payment_mode);
    }

    if (date_from) {
      whereClause += " AND p.payment_date >= ?";
      params.push(date_from);
    }

    if (date_to) {
      whereClause += " AND p.payment_date <= ?";
      params.push(date_to);
    }

    const [payments] = await db.query(
      `SELECT p.*, i.invoice_number, i.customer_name, b.booking_number
       FROM payments p
       LEFT JOIN invoices i ON p.invoice_id = i.id
       LEFT JOIN bookings b ON p.booking_id = b.id
       ${whereClause}
       ORDER BY p.payment_date DESC, p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM payments p ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: payments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch payments" });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [[payment]] = await db.query(
      `SELECT p.*, i.invoice_number, i.customer_name, b.booking_number
       FROM payments p
       LEFT JOIN invoices i ON p.invoice_id = i.id
       LEFT JOIN bookings b ON p.booking_id = b.id
       WHERE p.id = ? AND p.franchise_id = ?`,
      [id, franchiseId]
    );

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    console.error("Get payment error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch payment" });
  }
};

export const createPayment = async (req, res) => {
  const connection = await getDb().getConnection();

  try {
    const franchiseId = req.user.franchise_id;
    const {
      invoice_id,
      booking_id,
      consignment_number,
      amount,
      payment_mode,
      payment_date,
      transaction_ref,
      notes,
      description,
    } = req.body;

    await connection.beginTransaction();

    let finalBookingId = booking_id;
    let finalInvoiceId = invoice_id;

    // If consignment_number is provided, look up the booking
    if (consignment_number && !finalBookingId) {
      const [[booking]] = await connection.query(
        "SELECT id FROM bookings WHERE consignment_number = ? AND franchise_id = ?",
        [consignment_number, franchiseId]
      );

      if (booking) {
        finalBookingId = booking.id;
      }
    }

    // Insert payment
    const [result] = await connection.query(
      `INSERT INTO payments 
       (franchise_id, invoice_id, booking_id, amount, payment_mode, payment_date, transaction_ref, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        franchiseId,
        finalInvoiceId || null,
        finalBookingId || null,
        amount,
        payment_mode,
        payment_date,
        transaction_ref || description || null,
        notes || description || null,
      ]
    );

    // Update invoice payment status if linked to invoice
    if (finalInvoiceId) {
      const [[invoice]] = await connection.query(
        "SELECT total_amount FROM invoices WHERE id = ? AND franchise_id = ?",
        [finalInvoiceId, franchiseId]
      );

      if (invoice) {
        const [[{ total_paid }]] = await connection.query(
          "SELECT COALESCE(SUM(amount), 0) as total_paid FROM payments WHERE invoice_id = ?",
          [finalInvoiceId]
        );

        let paymentStatus = "pending";
        if (total_paid >= invoice.total_amount) {
          paymentStatus = "paid";
        } else if (total_paid > 0) {
          paymentStatus = "partial";
        }

        await connection.query(
          "UPDATE invoices SET payment_status = ? WHERE id = ?",
          [paymentStatus, finalInvoiceId]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      data: { id: result.insertId },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Create payment error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to record payment" });
  } finally {
    connection.release();
  }
};

export const updatePayment = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const { amount, payment_mode, payment_date, transaction_ref, notes } =
      req.body;
    const db = getDb();

    const [result] = await db.query(
      `UPDATE payments 
       SET amount = ?, payment_mode = ?, payment_date = ?, transaction_ref = ?, notes = ?
       WHERE id = ? AND franchise_id = ?`,
      [
        amount,
        payment_mode,
        payment_date,
        transaction_ref,
        notes,
        id,
        franchiseId,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    res.json({ success: true, message: "Payment updated successfully" });
  } catch (error) {
    console.error("Update payment error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update payment" });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [result] = await db.query(
      "DELETE FROM payments WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    res.json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Delete payment error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete payment" });
  }
};

// Get invoice summary for payments (GST/Non-GST)
export const getInvoiceSummary = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { gst } = req.query;
    const db = getDb();

    let whereClause = "WHERE i.franchise_id = ?";
    const params = [franchiseId];

    // Filter by GST or Non-GST invoices
    if (gst === "true") {
      whereClause += " AND (i.gst_percent > 0 OR i.gst_total > 0)";
    } else if (gst === "false") {
      whereClause += " AND (i.gst_percent = 0 OR i.gst_percent IS NULL)";
    }

    const [[summary]] = await db.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN i.payment_status = 'paid' THEN i.net_amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN i.payment_status = 'pending' THEN i.net_amount ELSE 0 END), 0) as unpaid_amount,
        COALESCE(SUM(i.net_amount), 0) as total_sale,
        COALESCE(SUM(CASE WHEN i.payment_status = 'partial' THEN i.net_amount ELSE 0 END), 0) as partial_paid
       FROM invoices i ${whereClause}`,
      params
    );

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error("Get invoice summary error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch summary" });
  }
};

// Get invoice list for adding payments
export const getInvoiceList = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { page = 1, limit = 10, payment_status, search, gst } = req.query;
    const offset = (page - 1) * limit;
    const db = getDb();

    let whereClause = "WHERE i.franchise_id = ?";
    const params = [franchiseId];

    // Filter by payment status
    if (payment_status && payment_status !== "All") {
      whereClause += " AND i.payment_status = ?";
      params.push(payment_status);
    }

    // Filter by GST or Non-GST
    if (gst === "true") {
      whereClause += " AND (i.gst_percent > 0 OR i.gst_total > 0)";
    } else if (gst === "false") {
      whereClause += " AND (i.gst_percent = 0 OR i.gst_percent IS NULL)";
    }

    // Search
    if (search) {
      whereClause += " AND (i.customer_id LIKE ? OR i.invoice_number LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Get total paid amount for each invoice
    const [invoices] = await db.query(
      `SELECT 
        i.*,
        i.sub_total,
        i.fuel_surcharge_percent,
        i.fuel_surcharge,
        i.gst_percent,
        i.gst_total,
        i.net_amount,
        COALESCE(SUM(p.amount), 0) as paid_amount,
        (i.net_amount - COALESCE(SUM(p.amount), 0)) as balance
       FROM invoices i
       LEFT JOIN payments p ON p.invoice_id = i.id
       ${whereClause}
       GROUP BY i.id
       ORDER BY i.invoice_date DESC, i.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(DISTINCT i.id) as total FROM invoices i ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: invoices,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get invoice list error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch invoice list" });
  }
};

// Get payment track details
export const getPaymentTrack = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const {
      page = 1,
      limit = 10,
      customer_id,
      from_date,
      to_date,
      search,
    } = req.query;
    const offset = (page - 1) * limit;
    const db = getDb();

    let whereClause = "WHERE p.franchise_id = ?";
    const params = [franchiseId];

    if (customer_id) {
      whereClause += " AND i.customer_id LIKE ?";
      params.push(`%${customer_id}%`);
    }

    if (from_date) {
      whereClause += " AND p.payment_date >= ?";
      params.push(from_date);
    }

    if (to_date) {
      whereClause += " AND p.payment_date <= ?";
      params.push(to_date);
    }

    if (search) {
      whereClause +=
        " AND (i.invoice_number LIKE ? OR i.customer_id LIKE ? OR p.payment_mode LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const [payments] = await db.query(
      `SELECT 
        p.*,
        i.invoice_number,
        i.invoice_date,
        i.customer_id,
        i.net_amount,
        (i.net_amount - COALESCE(
          (SELECT SUM(amount) FROM payments WHERE invoice_id = i.id), 0
        )) as balance
       FROM payments p
       LEFT JOIN invoices i ON p.invoice_id = i.id
       ${whereClause}
       ORDER BY p.payment_date DESC, p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total 
       FROM payments p
       LEFT JOIN invoices i ON p.invoice_id = i.id
       ${whereClause}`,
      params
    );

    // Calculate totals
    const [[totals]] = await db.query(
      `SELECT 
        COALESCE(SUM(i.net_amount), 0) as net_total,
        COALESCE(SUM(p.amount), 0) as total
       FROM payments p
       LEFT JOIN invoices i ON p.invoice_id = i.id
       ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: payments,
      totals,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get payment track error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch payment track" });
  }
};

// Get customer credit information
export const getCustomerCredit = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { customer_id } = req.query;
    const db = getDb();

    if (!customer_id) {
      return res
        .status(400)
        .json({ success: false, message: "Customer ID is required" });
    }

    // Get total credit (total paid) and balance (total unpaid)
    const [[creditData]] = await db.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN i.payment_status = 'paid' THEN i.net_amount ELSE 0 END), 0) as total_credit,
        COALESCE(SUM(CASE WHEN i.payment_status IN ('pending', 'partial') THEN 
          (i.net_amount - COALESCE((SELECT SUM(amount) FROM payments WHERE invoice_id = i.id), 0))
        ELSE 0 END), 0) as balance
       FROM invoices i
       WHERE i.franchise_id = ? AND i.customer_id = ?`,
      [franchiseId, customer_id]
    );

    res.json({ success: true, data: creditData });
  } catch (error) {
    console.error("Get customer credit error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch customer credit" });
  }
};

// Get consignment report for Daily Expenses payment tracking
export const getConsignmentReport = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    const db = getDb();

    let whereClause = "WHERE b.franchise_id = ?";
    const params = [franchiseId];

    if (search) {
      whereClause += " AND b.consignment_number LIKE ?";
      params.push(`%${search}%`);
    }

    // Get consignments with payment information
    const [consignments] = await db.query(
      `SELECT 
        b.id,
        b.consignment_number,
        b.booking_date,
        b.destination,
        b.receiver as sender_phone,
        u.full_name as sender,
        b.pincode as recipient_pincode,
        b.amount as charge_total,
        COALESCE(SUM(p.amount), 0) as paid_amount
       FROM bookings b
       LEFT JOIN users u ON b.customer_id = u.id
       LEFT JOIN payments p ON b.id = p.booking_id
       ${whereClause}
       GROUP BY b.id
       ORDER BY b.booking_date DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(DISTINCT b.id) as total FROM bookings b ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: consignments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get consignment report error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch consignment report" });
  }
};
