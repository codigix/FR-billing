import { getDb } from "../config/database.js";
import dayjs from "dayjs";

// Get all invoices with filters
export const getAllInvoices = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const {
      page = 1,
      limit = 20,
      status,
      search,
      company_name,
      invoice_number,
      from_date,
      to_date,
      type,
      without_gst,
    } = req.query;
    const offset = (page - 1) * limit;

    const db = getDb();
    let whereClause = "WHERE i.franchise_id = ?";
    const params = [franchiseId];

    if (status) {
      whereClause += " AND i.payment_status = ?";
      params.push(status);
    }

    if (search) {
      whereClause += " AND (i.invoice_number LIKE ? OR i.customer_id LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (company_name) {
      whereClause += " AND i.customer_id LIKE ?";
      params.push(`%${company_name}%`);
    }

    if (invoice_number) {
      whereClause += " AND i.invoice_number LIKE ?";
      params.push(`%${invoice_number}%`);
    }

    if (from_date) {
      whereClause += " AND i.invoice_date >= ?";
      params.push(from_date);
    }

    if (to_date) {
      whereClause += " AND i.invoice_date <= ?";
      params.push(to_date);
    }

    if (type === "single") {
      whereClause += " AND i.consignment_no IS NOT NULL";
    }

    if (without_gst === "true") {
      whereClause += " AND i.gst_percent = 0";
    }

    const [invoices] = await db.query(
      `SELECT i.*
       FROM invoices i
       ${whereClause}
       ORDER BY i.invoice_date DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM invoices i ${whereClause}`,
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
    console.error("Get invoices error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch invoices" });
  }
};

// Get invoice summary
export const getInvoiceSummary = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const db = getDb();

    const [[summary]] = await db.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN net_amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN payment_status = 'unpaid' THEN net_amount ELSE 0 END), 0) as unpaid_amount,
        COALESCE(SUM(net_amount), 0) as total_sale,
        COALESCE(SUM(CASE WHEN payment_status = 'partial' THEN net_amount ELSE 0 END), 0) as partial_paid
      FROM invoices
      WHERE franchise_id = ?`,
      [franchiseId]
    );

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Get summary error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch summary" });
  }
};

// Get single invoice summary (for View Single Invoice page)
export const getSingleInvoiceSummary = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const db = getDb();

    const [[summary]] = await db.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN net_amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN payment_status = 'unpaid' THEN net_amount ELSE 0 END), 0) as unpaid_amount,
        COALESCE(SUM(net_amount), 0) as total_sale,
        COALESCE(SUM(CASE WHEN payment_status = 'partial' THEN net_amount ELSE 0 END), 0) as partial_paid
      FROM invoices
      WHERE franchise_id = ? AND consignment_no IS NOT NULL`,
      [franchiseId]
    );

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Get single summary error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch summary" });
  }
};

// Generate invoice from multiple bookings
export const generateInvoice = async (req, res) => {
  const connection = await getDb().getConnection();

  try {
    const franchiseId = req.user.franchise_id;
    const {
      customer_id,
      address,
      invoice_no,
      invoice_date,
      period_from,
      period_to,
      invoice_discount,
      reverse_charge,
      gst_percent,
      bookings,
      total,
      fuel_surcharge_tax_percent,
      subtotal,
      royalty_charge,
      docket_charge,
      other_charge,
      net_amount,
    } = req.body;

    if (!customer_id || !period_from || !period_to) {
      return res.status(400).json({
        success: false,
        message: "Customer ID, Period From, and Period To are required",
      });
    }

    await connection.beginTransaction();

    // Generate invoice number if not provided
    let invoiceNumber = invoice_no;
    if (!invoiceNumber) {
      const [[{ count }]] = await connection.query(
        "SELECT COUNT(*) as count FROM invoices WHERE franchise_id = ? AND YEAR(invoice_date) = YEAR(CURDATE())",
        [franchiseId]
      );
      invoiceNumber = `INV/${dayjs().format("YYYY")}/${String(
        count + 1
      ).padStart(4, "0")}`;
    }

    // Calculate fuel surcharge
    const fuelSurchargeTotal =
      (parseFloat(subtotal) * parseFloat(fuel_surcharge_tax_percent)) / 100;
    const gstAmount = (parseFloat(net_amount) * parseFloat(gst_percent)) / 100;

    // Insert invoice
    const [result] = await connection.query(
      `INSERT INTO invoices 
       (franchise_id, invoice_number, invoice_date, customer_id, address, period_from, period_to,
        invoice_discount, reverse_charge, fuel_surcharge_percent, fuel_surcharge_total,
        gst_percent, gst_amount_new, other_charge, royalty_charge, docket_charge,
        total_amount, subtotal_amount, net_amount, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid')`,
      [
        franchiseId,
        invoiceNumber,
        invoice_date || dayjs().format("YYYY-MM-DD"),
        customer_id,
        address,
        period_from,
        period_to,
        invoice_discount ? 1 : 0,
        reverse_charge ? 1 : 0,
        fuel_surcharge_tax_percent || 0,
        fuelSurchargeTotal || 0,
        gst_percent || 18,
        gstAmount || 0,
        other_charge || 0,
        royalty_charge || 0,
        docket_charge || 0,
        total || 0,
        subtotal || 0,
        net_amount || 0,
      ]
    );

    const invoiceId = result.insertId;

    // Link bookings to invoice (if provided)
    if (bookings && Array.isArray(bookings) && bookings.length > 0) {
      for (const bookingId of bookings) {
        await connection.query(
          `INSERT INTO invoice_items (invoice_id, booking_id, description, quantity, unit_price, amount)
           SELECT ?, id, CONCAT('Booking: ', consignment_no), 1, total, total
           FROM bookings WHERE id = ?`,
          [invoiceId, bookingId]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Invoice generated successfully",
      data: { id: invoiceId, invoice_number: invoiceNumber },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Generate invoice error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate invoice" });
  } finally {
    connection.release();
  }
};

// Generate multiple invoices
export const generateMultipleInvoices = async (req, res) => {
  const connection = await getDb().getConnection();

  try {
    const franchiseId = req.user.franchise_id;
    const { customers, invoice_date, period_from, period_to, gst_percent } =
      req.body;

    if (!customers || customers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one customer",
      });
    }

    if (!period_from || !period_to) {
      return res.status(400).json({
        success: false,
        message: "Period From and Period To are required",
      });
    }

    await connection.beginTransaction();

    const db = getDb();
    let successCount = 0;

    for (const customerId of customers) {
      // Fetch bookings for this customer in the period
      const [bookings] = await db.query(
        `SELECT * FROM bookings 
         WHERE franchise_id = ? AND customer_id = ? 
         AND booking_date BETWEEN ? AND ?`,
        [franchiseId, customerId, period_from, period_to]
      );

      if (bookings.length === 0) {
        continue;
      }

      // Calculate totals
      const total = bookings.reduce(
        (sum, b) => sum + (parseFloat(b.total) || 0),
        0
      );
      const subtotal = total;
      const gstAmount = (total * parseFloat(gst_percent)) / 100;
      const netAmount = subtotal + gstAmount;

      // Generate invoice number
      const [[{ count }]] = await connection.query(
        "SELECT COUNT(*) as count FROM invoices WHERE franchise_id = ? AND YEAR(invoice_date) = YEAR(CURDATE())",
        [franchiseId]
      );
      const invoiceNumber = `INV/${dayjs().format("YYYY")}/${String(
        count + successCount + 1
      ).padStart(4, "0")}`;

      // Insert invoice
      const [result] = await connection.query(
        `INSERT INTO invoices 
         (franchise_id, invoice_number, invoice_date, customer_id, period_from, period_to,
          gst_percent, gst_amount_new, total_amount, subtotal_amount, net_amount, payment_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid')`,
        [
          franchiseId,
          invoiceNumber,
          invoice_date || dayjs().format("YYYY-MM-DD"),
          customerId,
          period_from,
          period_to,
          gst_percent || 18,
          gstAmount,
          total,
          subtotal,
          netAmount,
        ]
      );

      const invoiceId = result.insertId;

      // Link bookings
      for (const booking of bookings) {
        await connection.query(
          `INSERT INTO invoice_items (invoice_id, booking_id, description, quantity, unit_price, amount)
           VALUES (?, ?, ?, 1, ?, ?)`,
          [
            invoiceId,
            booking.id,
            `Booking: ${booking.consignment_no}`,
            booking.total,
            booking.total,
          ]
        );
      }

      successCount++;
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: `Successfully generated ${successCount} invoices`,
      count: successCount,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Generate multiple invoices error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate invoices" });
  } finally {
    connection.release();
  }
};

// Generate single invoice (single consignment)
export const generateSingleInvoice = async (req, res) => {
  const connection = await getDb().getConnection();

  try {
    const franchiseId = req.user.franchise_id;
    const {
      customer_id,
      invoice_no,
      invoice_date,
      period_from,
      period_to,
      consignment_no,
      address,
      invoice_discount,
      reverse_charge,
      gst_percent,
      booking_id,
      total,
      fuel_surcharge_tax_percent,
      subtotal,
      royalty_charge,
      docket_charge,
      other_charge,
      net_amount,
    } = req.body;

    if (!customer_id || !booking_id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID and Booking ID are required",
      });
    }

    await connection.beginTransaction();

    // Generate invoice number if not provided
    let invoiceNumber = invoice_no;
    if (!invoiceNumber) {
      const [[{ count }]] = await connection.query(
        "SELECT COUNT(*) as count FROM invoices WHERE franchise_id = ? AND YEAR(invoice_date) = YEAR(CURDATE())",
        [franchiseId]
      );
      invoiceNumber = `INV/${dayjs().format("YYYY")}/${String(
        count + 1
      ).padStart(4, "0")}`;
    }

    // Calculate values
    const fuelSurchargeTotal =
      (parseFloat(subtotal) * parseFloat(fuel_surcharge_tax_percent)) / 100;
    const gstAmount = (parseFloat(net_amount) * parseFloat(gst_percent)) / 100;

    // Insert invoice
    const [result] = await connection.query(
      `INSERT INTO invoices 
       (franchise_id, invoice_number, invoice_date, customer_id, address, period_from, period_to,
        consignment_no, invoice_discount, reverse_charge, fuel_surcharge_percent, fuel_surcharge_total,
        gst_percent, gst_amount_new, other_charge, royalty_charge, docket_charge,
        total_amount, subtotal_amount, net_amount, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid')`,
      [
        franchiseId,
        invoiceNumber,
        invoice_date || dayjs().format("YYYY-MM-DD"),
        customer_id,
        address,
        period_from,
        period_to,
        consignment_no,
        invoice_discount ? 1 : 0,
        reverse_charge ? 1 : 0,
        fuel_surcharge_tax_percent || 0,
        fuelSurchargeTotal || 0,
        gst_percent || 18,
        gstAmount || 0,
        other_charge || 0,
        royalty_charge || 0,
        docket_charge || 0,
        total || 0,
        subtotal || 0,
        net_amount || 0,
      ]
    );

    const invoiceId = result.insertId;

    // Link booking to invoice
    await connection.query(
      `INSERT INTO invoice_items (invoice_id, booking_id, description, quantity, unit_price, amount)
       SELECT ?, id, CONCAT('Booking: ', consignment_no), 1, total, total
       FROM bookings WHERE id = ?`,
      [invoiceId, booking_id]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Single invoice generated successfully",
      data: { id: invoiceId, invoice_number: invoiceNumber },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Generate single invoice error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate invoice" });
  } finally {
    connection.release();
  }
};

// Generate invoice without GST
export const generateInvoiceWithoutGST = async (req, res) => {
  const connection = await getDb().getConnection();

  try {
    const franchiseId = req.user.franchise_id;
    const {
      customer_id,
      address,
      period_from,
      period_to,
      invoice_date,
      invoice_discount,
      reverse_charge,
      bookings,
      total,
      subtotal,
      royalty_charge,
      docket_charge,
      other_charge,
      net_amount,
    } = req.body;

    if (!customer_id || !period_from || !period_to) {
      return res.status(400).json({
        success: false,
        message: "Customer ID, Period From, and Period To are required",
      });
    }

    await connection.beginTransaction();

    // Generate invoice number
    const [[{ count }]] = await connection.query(
      "SELECT COUNT(*) as count FROM invoices WHERE franchise_id = ? AND YEAR(invoice_date) = YEAR(CURDATE())",
      [franchiseId]
    );
    const invoiceNumber = `INV/${dayjs().format("YYYY")}/WG/${String(
      count + 1
    ).padStart(4, "0")}`;

    // Insert invoice without GST
    const [result] = await connection.query(
      `INSERT INTO invoices 
       (franchise_id, invoice_number, invoice_date, customer_id, address, period_from, period_to,
        invoice_discount, reverse_charge, gst_percent, gst_amount_new,
        other_charge, royalty_charge, docket_charge,
        total_amount, subtotal_amount, net_amount, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?, 'unpaid')`,
      [
        franchiseId,
        invoiceNumber,
        invoice_date || dayjs().format("YYYY-MM-DD"),
        customer_id,
        address,
        period_from,
        period_to,
        invoice_discount ? 1 : 0,
        reverse_charge ? 1 : 0,
        other_charge || 0,
        royalty_charge || 0,
        docket_charge || 0,
        total || 0,
        subtotal || 0,
        net_amount || 0,
      ]
    );

    const invoiceId = result.insertId;

    // Link bookings to invoice
    if (bookings && Array.isArray(bookings) && bookings.length > 0) {
      for (const bookingId of bookings) {
        await connection.query(
          `INSERT INTO invoice_items (invoice_id, booking_id, description, quantity, unit_price, amount)
           SELECT ?, id, CONCAT('Booking: ', consignment_no), 1, total, total
           FROM bookings WHERE id = ?`,
          [invoiceId, bookingId]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Invoice without GST generated successfully",
      data: { id: invoiceId, invoice_number: invoiceNumber },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Generate invoice without GST error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate invoice" });
  } finally {
    connection.release();
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [[invoice]] = await db.query(
      "SELECT * FROM invoices WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    const [items] = await db.query(
      `SELECT ii.*, b.consignment_no 
       FROM invoice_items ii
       LEFT JOIN bookings b ON ii.booking_id = b.id
       WHERE ii.invoice_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...invoice,
        items,
      },
    });
  } catch (error) {
    console.error("Get invoice error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch invoice" });
  }
};

// Update invoice
export const updateInvoice = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const { payment_status, paid_amount } = req.body;
    const db = getDb();

    const [result] = await db.query(
      `UPDATE invoices 
       SET payment_status = ?, paid_amount = ?, balance_amount = net_amount - ?
       WHERE id = ? AND franchise_id = ?`,
      [payment_status, paid_amount || 0, paid_amount || 0, id, franchiseId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    res.json({ success: true, message: "Invoice updated successfully" });
  } catch (error) {
    console.error("Update invoice error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update invoice" });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [result] = await db.query(
      "DELETE FROM invoices WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    res.json({ success: true, message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Delete invoice error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete invoice" });
  }
};

// Get recycled (cancelled) invoices
export const getRecycledInvoices = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const db = getDb();
    let whereClause = "WHERE franchise_id = ? AND status = 'cancelled'";
    const params = [franchiseId];

    if (search) {
      whereClause += " AND (invoice_number LIKE ? OR customer_id LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Get total count
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM invoices ${whereClause}`,
      params
    );

    // Get recycled invoices
    const [invoices] = await db.query(
      `SELECT id, invoice_number, customer_id, invoice_date, total_amount as net_amount
       FROM invoices ${whereClause}
       ORDER BY invoice_date DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: {
        invoices,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(countResult[0].total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get recycled invoices error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recycled invoices",
    });
  }
};
