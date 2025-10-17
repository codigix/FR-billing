import { getDb } from "../config/database.js";

// Creditors Report
export const getCreditorsReport = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { customerId, fromDate, toDate, status, invoiceType } = req.query;

    const db = getDb();
    let sql = `
      SELECT 
        invoices.*,
        CASE WHEN invoices.gst_percent > 0 THEN 'GST' ELSE 'Non-GST' END as invoice_type,
        invoices.customer_id as customer_name,
        DATEDIFF(CURDATE(), invoices.invoice_date) as due_days,
        invoices.gst_amount_new / 2 as cgst
      FROM invoices
      WHERE invoices.franchise_id = ?
    `;
    const params = [franchiseId];

    // Apply filters
    if (customerId) {
      sql += " AND invoices.customer_id LIKE ?";
      params.push(`%${customerId}%`);
    }

    if (fromDate && toDate) {
      sql += " AND invoices.invoice_date BETWEEN ? AND ?";
      params.push(fromDate, toDate);
    }

    if (status && status !== "All") {
      sql += " AND invoices.payment_status = ?";
      params.push(status.toLowerCase());
    }

    if (invoiceType && invoiceType !== "All") {
      if (invoiceType === "GST") {
        sql += " AND invoices.gst_percent > 0";
      } else if (invoiceType === "Non-GST") {
        sql +=
          " AND (invoices.gst_percent = 0 OR invoices.gst_percent IS NULL)";
      }
    }

    sql += " ORDER BY invoices.invoice_date DESC";

    const [data] = await db.query(sql, params);

    // Calculate summary
    const summary = {
      total: data.reduce((sum, row) => sum + Number(row.total_amount || 0), 0),
      paid: data.reduce((sum, row) => sum + Number(row.paid_amount || 0), 0),
      balance: data.reduce(
        (sum, row) => sum + Number(row.balance_amount || 0),
        0
      ),
    };

    res.json({
      success: true,
      data,
      summary,
    });
  } catch (error) {
    console.error("Error in getCreditorsReport:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch creditors report",
      error: error.message,
    });
  }
};

// Sale Report Before Invoice
export const getSaleReportBeforeInvoice = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { fromDate, toDate } = req.query;

    const db = getDb();
    let sql = `
      SELECT 
        bookings.customer_id as company_id,
        bookings.customer_id as customer_name,
        SUM(bookings.total) as total,
        COUNT(*) as booking_count
      FROM bookings
      WHERE bookings.franchise_id = ?
    `;
    const params = [franchiseId];

    // Apply date filters
    if (fromDate && toDate) {
      sql += " AND bookings.booking_date BETWEEN ? AND ?";
      params.push(fromDate, toDate);
    }

    sql += " GROUP BY bookings.customer_id";

    const [data] = await db.query(sql, params);

    // Calculate summary
    const summary = {
      total: data.reduce((sum, row) => sum + Number(row.total || 0), 0),
    };

    res.json({
      success: true,
      data,
      summary,
    });
  } catch (error) {
    console.error("Error in getSaleReportBeforeInvoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sale report",
      error: error.message,
    });
  }
};

// Tax Report
export const getTaxReport = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { customerId, fromDate, toDate } = req.query;

    const db = getDb();
    let sql = `
      SELECT 
        invoices.*,
        invoices.gst_amount_new / 2 as cgst
      FROM invoices
      WHERE invoices.franchise_id = ?
    `;
    const params = [franchiseId];

    // Apply filters
    if (customerId) {
      sql += " AND invoices.customer_id LIKE ?";
      params.push(`%${customerId}%`);
    }

    if (fromDate && toDate) {
      sql += " AND invoices.invoice_date BETWEEN ? AND ?";
      params.push(fromDate, toDate);
    }

    sql += " ORDER BY invoices.invoice_date DESC";

    const [data] = await db.query(sql, params);

    // Calculate summary
    const summary = {
      netTotal: data.reduce((sum, row) => sum + Number(row.net_amount || 0), 0),
    };

    res.json({
      success: true,
      data,
      summary,
    });
  } catch (error) {
    console.error("Error in getTaxReport:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tax report",
      error: error.message,
    });
  }
};

// Billed/Unbilled List
export const getBilledUnbilledList = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { fromDate, toDate, status } = req.query;

    const db = getDb();
    let sql = `
      SELECT 
        bookings.consignment_number,
        bookings.pincode,
        bookings.booking_date,
        bookings.customer_id,
        bookings.act_wt,
        bookings.char_wt,
        bookings.qty,
        bookings.amount,
        CASE WHEN EXISTS (SELECT 1 FROM invoices WHERE FIND_IN_SET(bookings.consignment_number, REPLACE(invoices.consignment_no, ',', ','))) THEN 'Billed' ELSE 'Unbilled' END as billing_status
      FROM bookings
      WHERE bookings.franchise_id = ?
    `;
    const params = [franchiseId];

    // Apply date filters
    if (fromDate && toDate) {
      sql += " AND bookings.booking_date BETWEEN ? AND ?";
      params.push(fromDate, toDate);
    }

    sql += " ORDER BY bookings.booking_date DESC";

    let [data] = await db.query(sql, params);

    // Apply status filter after query
    if (status && status !== "All") {
      data = data.filter((row) => row.billing_status === status);
    }

    // Calculate summary
    const summary = {
      totalAmount: data.reduce((sum, row) => sum + Number(row.amount || 0), 0),
      totalConsignment: data.length,
    };

    res.json({
      success: true,
      data,
      summary,
    });
  } catch (error) {
    console.error("Error in getBilledUnbilledList:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch billed/unbilled list",
      error: error.message,
    });
  }
};

// Business Analysis
export const getBusinessAnalysis = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { customerId, fromDate, toDate } = req.query;

    const db = getDb();
    let sql = `
      SELECT 
        bookings.consignment_number,
        bookings.booking_date,
        bookings.char_wt as weight,
        bookings.destination,
        bookings.amount,
        bookings.dtdc_amt as dtdc_amount,
        (bookings.amount - bookings.dtdc_amt) as profit_loss,
        CONCAT(ROUND(((bookings.amount - bookings.dtdc_amt) / bookings.amount) * 100, 2), '%') as profit_loss_percent
      FROM bookings
      WHERE bookings.franchise_id = ?
    `;
    const params = [franchiseId];

    // Apply filters
    if (customerId) {
      sql += " AND bookings.customer_id LIKE ?";
      params.push(`%${customerId}%`);
    }

    if (fromDate && toDate) {
      sql += " AND bookings.booking_date BETWEEN ? AND ?";
      params.push(fromDate, toDate);
    }

    sql += " ORDER BY bookings.booking_date DESC";

    const [data] = await db.query(sql, params);

    // Calculate summary
    const total = data.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const dtdcTotal = data.reduce(
      (sum, row) => sum + Number(row.dtdc_amount || 0),
      0
    );
    const profitLoss = total - dtdcTotal;
    const profitLossPercent =
      total > 0 ? ((profitLoss / total) * 100).toFixed(2) : 0;

    const summary = {
      total,
      dtdcTotal,
      profitLoss,
      profitLossPercent,
    };

    res.json({
      success: true,
      data,
      summary,
    });
  } catch (error) {
    console.error("Error in getBusinessAnalysis:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch business analysis",
      error: error.message,
    });
  }
};

// Customer Sales Comparison
export const getCustomerSalesComparison = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;

    // Get current date
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentYear = today.getFullYear();

    // Calculate previous month and last month
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const previousMonth = lastMonth === 0 ? 11 : lastMonth - 1;
    const previousMonthYear =
      lastMonth === 0 ? lastMonthYear - 1 : lastMonthYear;

    // Month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const db = getDb();

    // Get sales data for previous month
    const [previousMonthData] = await db.query(
      `SELECT 
        bookings.customer_id as company_id,
        SUM(bookings.total) as previous_month_sale
      FROM bookings
      WHERE bookings.franchise_id = ?
        AND MONTH(bookings.booking_date) = ?
        AND YEAR(bookings.booking_date) = ?
      GROUP BY bookings.customer_id`,
      [franchiseId, previousMonth + 1, previousMonthYear]
    );

    // Get sales data for last month
    const [lastMonthData] = await db.query(
      `SELECT 
        bookings.customer_id as company_id,
        SUM(bookings.total) as last_month_sale
      FROM bookings
      WHERE bookings.franchise_id = ?
        AND MONTH(bookings.booking_date) = ?
        AND YEAR(bookings.booking_date) = ?
      GROUP BY bookings.customer_id`,
      [franchiseId, lastMonth + 1, lastMonthYear]
    );

    // Merge data
    const allCustomers = new Set([
      ...previousMonthData.map((r) => r.company_id),
      ...lastMonthData.map((r) => r.company_id),
    ]);

    const data = Array.from(allCustomers).map((customerId) => {
      const prevData = previousMonthData.find(
        (r) => r.company_id === customerId
      );
      const lastData = lastMonthData.find((r) => r.company_id === customerId);

      const previousSale = Number(prevData?.previous_month_sale || 0);
      const lastSale = Number(lastData?.last_month_sale || 0);
      const difference = lastSale - previousSale;
      const percentageChange =
        previousSale > 0
          ? ((difference / previousSale) * 100).toFixed(2)
          : lastSale > 0
          ? "100"
          : "0";

      let status = "No Change";
      if (difference > 0) status = "Increase";
      else if (difference < 0) status = "Decrease";

      return {
        company_id: customerId,
        company_name: customerId, // In production, join with company table
        previous_month_sale: previousSale,
        last_month_sale: lastSale,
        sales_difference: difference,
        percentage_change: percentageChange,
        status,
      };
    });

    // Calculate summary
    const summary = {
      previousMonth: monthNames[previousMonth],
      lastMonth: monthNames[lastMonth],
      previousMonthTotal: data.reduce(
        (sum, row) => sum + Number(row.previous_month_sale || 0),
        0
      ),
      lastMonthTotal: data.reduce(
        (sum, row) => sum + Number(row.last_month_sale || 0),
        0
      ),
    };

    res.json({
      success: true,
      data,
      summary,
    });
  } catch (error) {
    console.error("Error in getCustomerSalesComparison:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales comparison",
      error: error.message,
    });
  }
};

// ============ CASHCOUNTER REPORTS ============

// Cashcounter Sales Report
export const getCashSalesReport = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { fromDate, toDate, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const db = getDb();
    let sql = `
      SELECT 
        b.id,
        b.consignment_number,
        b.destination,
        u.state as sender_city,
        u.pincode as sender_pincode,
        b.receiver as recipient_name,
        b.pincode as recipient_pincode,
        b.booking_date,
        b.amount
      FROM bookings b
      LEFT JOIN users u ON b.customer_id = u.id
      WHERE b.franchise_id = ?
    `;
    const params = [franchiseId];

    if (fromDate && toDate) {
      sql += " AND b.booking_date BETWEEN ? AND ?";
      params.push(fromDate, toDate);
    }

    if (search) {
      sql += " AND b.consignment_number LIKE ?";
      params.push(`%${search}%`);
    }

    sql += " ORDER BY b.booking_date DESC LIMIT ? OFFSET ?";
    const [data] = await db.query(sql, [
      ...params,
      Number(limit),
      Number(offset),
    ]);

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM bookings WHERE franchise_id = ? ${
        fromDate && toDate ? "AND booking_date BETWEEN ? AND ?" : ""
      } ${search ? "AND consignment_number LIKE ?" : ""}`,
      fromDate && toDate
        ? [franchiseId, fromDate, toDate, `%${search}%`]
        : search
        ? [franchiseId, `%${search}%`]
        : [franchiseId]
    );

    const totalAmount = data.reduce(
      (sum, row) => sum + (parseFloat(row.amount) || 0),
      0
    );

    res.json({
      success: true,
      data,
      total,
      pagination: { page: Number(page), limit: Number(limit), total },
      totalAmount,
    });
  } catch (error) {
    console.error("Cashcounter sales report error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch sales report" });
  }
};

// Cashcounter Daily Report
export const getCashDailyReport = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { date, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const db = getDb();

    // Get consignments for the day
    const [consignments] = await db.query(
      `SELECT 
        b.id,
        b.consignment_number,
        u.full_name as sender,
        u.phone as sender_phone,
        b.destination,
        b.act_wt,
        b.char_wt,
        b.payment_mode,
        COALESCE(SUM(p.amount), 0) as paid_amount
      FROM bookings b
      LEFT JOIN users u ON b.customer_id = u.id
      LEFT JOIN payments p ON b.id = p.booking_id
      WHERE b.franchise_id = ? AND DATE(b.booking_date) = ?
      ${search ? "AND b.consignment_number LIKE ?" : ""}
      GROUP BY b.id
      ORDER BY b.booking_date DESC
      LIMIT ? OFFSET ?`,
      search
        ? [franchiseId, date, `%${search}%`, Number(limit), Number(offset)]
        : [franchiseId, date, Number(limit), Number(offset)]
    );

    // Get expenses for the day
    const [expenses] = await db.query(
      `SELECT amount, description FROM expenses 
       WHERE franchise_id = ? AND DATE(expense_date) = ?
       ORDER BY expense_date DESC`,
      [franchiseId, date]
    );

    // Get payments for the day
    const [payments] = await db.query(
      `SELECT 
        p.id,
        b.consignment_number,
        p.amount,
        p.notes as description
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      WHERE p.franchise_id = ? AND DATE(p.payment_date) = ?
      ORDER BY p.payment_date DESC`,
      [franchiseId, date]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM bookings 
       WHERE franchise_id = ? AND DATE(booking_date) = ?`,
      [franchiseId, date]
    );

    res.json({
      success: true,
      consignments,
      expenses,
      payments,
      pagination: { page: Number(page), limit: Number(limit), total },
    });
  } catch (error) {
    console.error("Cashcounter daily report error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch daily report" });
  }
};

// Cashcounter Creditors Report
export const getCashCreditorsReport = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { fromDate, toDate, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const db = getDb();
    let sql = `
      SELECT 
        b.id,
        b.consignment_number,
        u.full_name as sender_name,
        u.phone as sender_phone,
        b.receiver,
        b.receiver as receiver_phone,
        b.pincode as destination_pincode,
        b.booking_date,
        b.amount,
        COALESCE(SUM(p.amount), 0) as paid_amount
      FROM bookings b
      LEFT JOIN users u ON b.customer_id = u.id
      LEFT JOIN payments p ON b.id = p.booking_id
      WHERE b.franchise_id = ?
    `;
    const params = [franchiseId];

    if (fromDate && toDate) {
      sql += " AND b.booking_date BETWEEN ? AND ?";
      params.push(fromDate, toDate);
    }

    if (search) {
      sql += " AND b.consignment_number LIKE ?";
      params.push(`%${search}%`);
    }

    sql += " GROUP BY b.id ORDER BY b.booking_date DESC LIMIT ? OFFSET ?";

    const [data] = await db.query(sql, [
      ...params,
      Number(limit),
      Number(offset),
    ]);

    // Get total count
    let countSql = `SELECT COUNT(DISTINCT b.id) as total FROM bookings b WHERE b.franchise_id = ?`;
    const countParams = [franchiseId];

    if (fromDate && toDate) {
      countSql += " AND b.booking_date BETWEEN ? AND ?";
      countParams.push(fromDate, toDate);
    }

    if (search) {
      countSql += " AND b.consignment_number LIKE ?";
      countParams.push(`%${search}%`);
    }

    const [[{ total }]] = await db.query(countSql, countParams);

    // Calculate summary
    const totalAmount = data.reduce(
      (sum, row) => sum + (parseFloat(row.amount) || 0),
      0
    );
    const totalPaid = data.reduce(
      (sum, row) => sum + (parseFloat(row.paid_amount) || 0),
      0
    );
    const balanceAmount = totalAmount - totalPaid;

    res.json({
      success: true,
      data,
      total,
      pagination: { page: Number(page), limit: Number(limit), total },
      summary: {
        totalAmount,
        paidAmount: totalPaid,
        balanceAmount,
      },
    });
  } catch (error) {
    console.error("Cashcounter creditors report error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch creditors report" });
  }
};
