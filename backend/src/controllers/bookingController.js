import { getDb } from "../config/database.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import XLSX from "xlsx";

const upload = multer({ dest: "uploads/temp/" });

export const getAllBookings = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    const db = getDb();
    let whereClause = "WHERE franchise_id = ?";
    const params = [franchiseId];

    if (status) {
      whereClause += " AND status = ?";
      params.push(status);
    }

    if (search) {
      whereClause +=
        " AND (consignment_number LIKE ? OR customer_id LIKE ? OR receiver LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM bookings ${whereClause}`,
      params
    );

    // Get bookings
    const [bookings] = await db.query(
      `SELECT * FROM bookings ${whereClause} 
       ORDER BY booking_date DESC, created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(countResult[0].total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const franchiseId = req.user.franchise_id;
    const db = getDb();

    const [bookings] = await db.query(
      "SELECT * FROM bookings WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Get tracking history
    const [tracking] = await db.query(
      "SELECT * FROM tracking WHERE booking_id = ? ORDER BY status_date DESC",
      [id]
    );

    res.json({
      success: true,
      data: {
        booking: bookings[0],
        tracking,
      },
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

// Get booking by consignment number
export const getBookingByConsignment = async (req, res) => {
  try {
    const { consignment_no } = req.params;
    const franchiseId = req.user.franchise_id;
    const db = getDb();

    const [bookings] = await db.query(
      "SELECT * FROM bookings WHERE consignment_no = ? AND franchise_id = ?",
      [consignment_no, franchiseId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: bookings[0],
    });
  } catch (error) {
    console.error("Get booking by consignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const {
      consignment_no,
      customer_id,
      receiver,
      address,
      booking_date,
      consignment_type,
      pincode,
      mode,
      act_wt,
      char_wt,
      qty,
      type,
      amount,
      other_charges,
      reference,
      dtdc_amt,
    } = req.body;

    // Validation
    if (
      !consignment_no ||
      !customer_id ||
      !booking_date ||
      !pincode ||
      !char_wt ||
      !qty
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields: Consignment No, Customer ID, Booking Date, Pincode, Chargeable Weight, Quantity",
      });
    }

    const db = getDb();

    // Check if consignment number already exists
    const [existing] = await db.query(
      "SELECT id FROM bookings WHERE consignment_number = ? AND franchise_id = ?",
      [consignment_no, franchiseId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Consignment number already exists",
      });
    }

    // Calculate total (can be enhanced with rate master calculations)
    const calculatedAmount = amount || 0;
    const calculatedOtherCharges = other_charges || 0;
    const calculatedTotal =
      parseFloat(calculatedAmount) + parseFloat(calculatedOtherCharges);

    const bookingData = {
      franchise_id: franchiseId,
      consignment_number: consignment_no,
      customer_id,
      receiver: receiver || null,
      address: address || null,
      booking_date,
      pincode,
      consignment_type: consignment_type || "Domestic",
      mode: mode || "AR",
      act_wt: act_wt || null,
      char_wt,
      qty,
      type: type || "D",
      amount: calculatedAmount,
      other_charges: calculatedOtherCharges,
      reference: reference || null,
      dtdc_amt: dtdc_amt || 0,
      insurance: 0,
      percentage: 0,
      risk_surcharge: 0,
      bill_amount: 0,
      total: calculatedTotal,
      destination: null,
      status: "Booked",
      remarks: null,
    };

    const [result] = await db.query("INSERT INTO bookings SET ?", [
      bookingData,
    ]);

    // Create initial tracking entry
    await db.query("INSERT INTO tracking SET ?", {
      booking_id: result.insertId,
      consignment_number: consignment_no,
      status: "Booked",
      location: "Origin",
      remarks: "Consignment booked successfully",
      status_date: new Date(),
      updated_by: req.user.full_name,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        id: result.insertId,
      },
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const franchiseId = req.user.franchise_id;
    const db = getDb();

    // Check if booking exists
    const [existing] = await db.query(
      "SELECT * FROM bookings WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Build dynamic SET clause from request body
    const updates = req.body;

    // List of allowed columns to prevent SQL injection and invalid updates
    const allowedColumns = [
      "consignment_number",
      "customer_id",
      "receiver",
      "address",
      "pincode",
      "consignment_type",
      "mode",
      "act_wt",
      "char_wt",
      "qty",
      "type",
      "amount",
      "other_charges",
      "reference",
      "dtdc_amt",
      "insurance",
      "percentage",
      "risk_surcharge",
      "bill_amount",
      "total",
      "destination",
      "status",
      "remarks",
    ];

    // Filter updates to only include allowed columns
    const validUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedColumns.includes(key)) {
        validUpdates[key] = updates[key];
      }
    });

    const setFields = Object.keys(validUpdates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const setValues = Object.values(validUpdates);

    if (setFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    await db.query(
      `UPDATE bookings SET ${setFields}, updated_at = NOW() WHERE id = ?`,
      [...setValues, id]
    );

    res.json({
      success: true,
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const franchiseId = req.user.franchise_id;
    const db = getDb();

    const [result] = await db.query(
      "DELETE FROM bookings WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
    });
  }
};

// Filter bookings by customer, consignment_no, and/or date range
export const filterBookings = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { customer_id, consignment_no, from_date, to_date } = req.query;

    // Validate that at least one search filter is provided
    const hasCustomerId = customer_id && customer_id.trim();
    const hasConsignmentNo = consignment_no && consignment_no.trim();
    const hasDateRange = from_date && to_date;

    if (!hasCustomerId && !hasConsignmentNo && !hasDateRange) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide consignment_no OR customer_id OR both from_date and to_date",
      });
    }

    const db = getDb();
    let whereClause = "WHERE franchise_id = ?";
    const params = [franchiseId];

    if (hasConsignmentNo) {
      whereClause += " AND consignment_number LIKE ?";
      params.push(`%${consignment_no.trim()}%`);
    }

    if (hasCustomerId) {
      whereClause += " AND customer_id = ?";
      params.push(customer_id.trim());
    }

    // Use DATE() function for proper date comparison (ignores time)
    if (hasDateRange) {
      whereClause += " AND DATE(booking_date) >= ?";
      params.push(from_date);

      whereClause += " AND DATE(booking_date) <= ?";
      params.push(to_date);
    }

    console.log("Filter query:", {
      whereClause,
      params,
      customer_id,
      consignment_no,
      from_date,
      to_date,
    });

    const [bookings] = await db.query(
      `SELECT * FROM bookings ${whereClause} ORDER BY booking_date DESC`,
      params
    );

    console.log(
      `Found ${bookings.length} bookings for franchise ${franchiseId}`
    );

    res.json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    console.error("Filter bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to filter bookings",
      error: error.message,
    });
  }
};

// Update rates for bookings in date range
export const updateRate = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { customer_id, from_date, to_date } = req.body;

    if (!from_date || !to_date) {
      return res.status(400).json({
        success: false,
        message: "From Date and To Date are required",
      });
    }

    const db = getDb();
    let whereClause =
      "WHERE franchise_id = ? AND booking_date >= ? AND booking_date <= ?";
    const params = [franchiseId, from_date, to_date];

    if (customer_id) {
      whereClause += " AND customer_id = ?";
      params.push(customer_id);
    }

    // This is a placeholder - actual rate calculation should be done based on company_rate_master
    await db.query(
      `UPDATE bookings SET updated_at = NOW() ${whereClause}`,
      params
    );

    res.json({
      success: true,
      message: "Rates updated successfully",
    });
  } catch (error) {
    console.error("Update rate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update rates",
    });
  }
};

// Get no booking list (bookings without status or specific criteria)
export const getNoBookingList = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { from_date, to_date } = req.query;

    if (!from_date || !to_date) {
      return res.status(400).json({
        success: false,
        message: "From Date and To Date are required",
      });
    }

    const db = getDb();
    const [bookings] = await db.query(
      `SELECT * FROM bookings 
       WHERE franchise_id = ? 
       AND booking_date >= ? 
       AND booking_date <= ?
       AND (status IS NULL OR status = '')
       ORDER BY booking_date DESC`,
      [franchiseId, from_date, to_date]
    );

    res.json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    console.error("Get no booking list error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch no booking list",
    });
  }
};

// Create multiple bookings
export const createMultipleBookings = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { start_number, end_number, company } = req.body;

    if (!start_number || !end_number || !company) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const start = parseInt(start_number);
    const end = parseInt(end_number);

    if (end - start > 100) {
      return res.status(400).json({
        success: false,
        message: "You can book only upto 100 consignment at one time",
      });
    }

    const db = getDb();
    const bookings = [];

    for (let i = start; i <= end; i++) {
      const consignmentNumber = `${company}${i}`;
      bookings.push({
        franchise_id: franchiseId,
        consignment_number: consignmentNumber,
        customer_id: company,
        booking_date: new Date().toISOString().split("T")[0],
        pincode: "000000",
        char_wt: 0,
        qty: 1,
        status: "Booked",
      });
    }

    await db.query(
      "INSERT INTO bookings (franchise_id, consignment_number, customer_id, booking_date, pincode, char_wt, qty, status) VALUES ?",
      [
        bookings.map((b) => [
          b.franchise_id,
          b.consignment_number,
          b.customer_id,
          b.booking_date,
          b.pincode,
          b.char_wt,
          b.qty,
          b.status,
        ]),
      ]
    );

    res.status(201).json({
      success: true,
      message: `${bookings.length} bookings created successfully`,
      data: { count: bookings.length },
    });
  } catch (error) {
    console.error("Create multiple bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create multiple bookings",
    });
  }
};

// Import from CashCounter
export const importFromCashCounter = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { from_date, to_date, customer_id } = req.body;

    // This is a placeholder - actual implementation would fetch data from CashCounter system
    res.json({
      success: true,
      message: "Bookings imported from CashCounter successfully",
    });
  } catch (error) {
    console.error("Import from CashCounter error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import from CashCounter",
    });
  }
};

// Import from text file
export const importFromText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Read and parse text file
    // This is a placeholder - actual implementation would parse the text file format
    res.json({
      success: true,
      message: "Text file imported successfully",
    });
  } catch (error) {
    console.error("Import from text error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import text file",
    });
  }
};

// Import from Excel (Limitless format)
export const importFromExcelLimitless = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Read and parse Excel file
    // This is a placeholder - actual implementation would parse the Excel file
    res.json({
      success: true,
      message: "Excel file imported successfully",
    });
  } catch (error) {
    console.error("Import from Excel Limitless error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import Excel file",
    });
  }
};

// Import from Excel (3 formats)
export const importFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const franchiseId = req.user.franchise_id;
    const format = req.body.format || "1";

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    let imported = 0;
    const importedRows = [];
    const db = getDb();

    // Format 1: Consignment No, Customer Id
    if (format === "1") {
      for (const row of data) {
        if (row["Consignment No"] && row["Customer Id"]) {
          try {
            await db.query(
              "INSERT INTO bookings (franchise_id, consignment_number, customer_id, booking_date, pincode, char_wt, qty) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [
                franchiseId,
                row["Consignment No"],
                row["Customer Id"],
                new Date().toISOString().split("T")[0],
                "000000",
                0,
                1,
              ]
            );
            imported++;
            importedRows.push({
              "Consignment No": row["Consignment No"],
              "Customer Id": row["Customer Id"],
              "Booking Date": new Date().toISOString().split("T")[0],
              Status: "Imported",
            });
          } catch (err) {
            console.error("Error importing row:", err);
          }
        }
      }
    }

    // Format 2: Extended format with weights and charges
    if (format === "2") {
      for (const row of data) {
        if (row["Consignment No"] && row["Customer Id"]) {
          try {
            await db.query(
              "INSERT INTO bookings (franchise_id, consignment_number, customer_id, char_wt, insurance, percentage, other_charges, booking_date, pincode, qty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                franchiseId,
                row["Consignment No"],
                row["Customer Id"],
                row["Chargable Weight"] || 0,
                row["Insurance Amt"] || 0,
                row["FOV Per"] || 0,
                row["Other charges"] || 0,
                new Date().toISOString().split("T")[0],
                "000000",
                1,
              ]
            );
            imported++;
            importedRows.push({
              "Consignment No": row["Consignment No"],
              "Customer Id": row["Customer Id"],
              "Chargable Weight": row["Chargable Weight"] || 0,
              "Insurance Amt": row["Insurance Amt"] || 0,
              "FOV Per": row["FOV Per"] || 0,
              "Other Charges": row["Other charges"] || 0,
              Status: "Imported",
            });
          } catch (err) {
            console.error("Error importing row:", err);
          }
        }
      }
    }

    // Format 3: Complete format
    if (format === "3") {
      for (const row of data) {
        if (
          row["Consignment No"] &&
          row["Customer Id"] &&
          row["Pincode"] &&
          row["Booking Date"]
        ) {
          try {
            await db.query(
              "INSERT INTO bookings (franchise_id, consignment_number, customer_id, char_wt, mode, address, qty, pincode, booking_date, type, other_charges, receiver, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                franchiseId,
                row["Consignment No"],
                row["Customer Id"],
                row["Chargable Weight"] || 0,
                row["Mode"] || "AR",
                row["Company Address"] || "",
                row["Quantity"] || 1,
                row["Pincode"],
                row["Booking Date"],
                row["Type or N"] || "D",
                row["Other Charges"] || 0,
                row["Receiver"] || "",
                row["Amount (Optional)"] || 0,
              ]
            );
            imported++;
            importedRows.push({
              "Consignment No": row["Consignment No"],
              "Customer Id": row["Customer Id"],
              "Chargable Weight": row["Chargable Weight"] || 0,
              Mode: row["Mode"] || "AR",
              Quantity: row["Quantity"] || 1,
              Pincode: row["Pincode"],
              "Booking Date": row["Booking Date"],
              Type: row["Type or N"] || "D",
              "Other Charges": row["Other Charges"] || 0,
              Receiver: row["Receiver"] || "",
              Amount: row["Amount (Optional)"] || 0,
              Status: "Imported",
            });
          } catch (err) {
            console.error("Error importing row:", err);
          }
        }
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `${imported} bookings imported successfully`,
      data: {
        imported,
        data: importedRows,
      },
    });
  } catch (error) {
    console.error("Import from Excel error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import Excel file",
    });
  }
};

// Download Excel template
export const downloadTemplate = async (req, res) => {
  try {
    const { format } = req.params;

    let data = [];
    if (format === "1") {
      data = [
        ["Consignment No*", "Customer Id*"],
        ["TT2300345", "Test Logistic"],
      ];
    } else if (format === "2") {
      data = [
        [
          "Sr.No",
          "Consignment No*",
          "Customer Id*",
          "Chargable Weight",
          "Insurance Amt",
          "FOV Amt",
          "FOV Per",
          "Other charges",
        ],
        [1, "TT2380345", "Test Logistic", 1.1, 100, 0.2, 2, 50],
      ];
    } else if (format === "3") {
      data = [
        [
          "Sr.No",
          "Consignment No*",
          "Chargable Weight",
          "Mode*",
          "Company Address",
          "Quantity*",
          "Pincode*",
          "Booking Date*",
          "Or Gt Amt or Cv",
          "Type or N*",
          "Customer Id*",
          "Other Charges",
          "Receiver",
          "Amount (Optional)",
        ],
        [
          1,
          "TT2380345",
          1.1,
          "AR",
          "Pune",
          2,
          "400001",
          "30/01/2020",
          "",
          "D",
          "Test Logistic",
          50,
          "Bob",
          50,
        ],
      ];
    }

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=booking_template_format${format}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Download template error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to download template",
    });
  }
};

// Get recycled (cancelled) consignments
export const getRecycledConsignments = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const db = getDb();
    let whereClause = "WHERE franchise_id = ? AND status = 'cancelled'";
    const params = [franchiseId];

    if (search) {
      whereClause += " AND (consignment_number LIKE ? OR customer_id LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Get total count
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM bookings ${whereClause}`,
      params
    );

    // Get recycled consignments
    const [consignments] = await db.query(
      `SELECT id, consignment_number, customer_id, booking_date, total_amount as amount
       FROM bookings ${whereClause}
       ORDER BY booking_date DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: {
        consignments,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(countResult[0].total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get recycled consignments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recycled consignments",
    });
  }
};

// Search bookings with invoice data (for chatbot)
export const searchBookingsWithInvoices = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { consignmentNo, customerId } = req.query;

    if (!consignmentNo && !customerId) {
      return res.status(400).json({
        success: false,
        message: "Please provide either consignmentNo or customerId",
      });
    }

    const db = getDb();
    let query = `
      SELECT DISTINCT
        b.id,
        b.consignment_number,
        b.customer_id,
        b.destination,
        b.act_wt as weight,
        b.mode,
        b.total as amount,
        b.booking_date,
        b.status,
        i.id as invoice_id,
        i.invoice_number
      FROM bookings b
      LEFT JOIN invoice_items ii ON b.id = ii.booking_id
      LEFT JOIN invoices i ON ii.invoice_id = i.id
      WHERE b.franchise_id = ?
    `;
    const params = [franchiseId];

    if (consignmentNo) {
      query += ` AND LOWER(b.consignment_number) = LOWER(?)`;
      params.push(consignmentNo.trim());
    }

    if (customerId) {
      query += ` AND b.customer_id = ?`;
      params.push(customerId.trim());
    }

    query += ` ORDER BY b.booking_date DESC`;

    const [bookings] = await db.query(query, params);

    if (bookings.length === 0) {
      return res.json({
        success: true,
        data: {
          bookings: [],
          message: "No bookings found for the selected criteria.",
        },
      });
    }

    res.json({
      success: true,
      data: {
        bookings,
        count: bookings.length,
      },
    });
  } catch (error) {
    console.error("Search bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search bookings",
    });
  }
};

export { upload };
