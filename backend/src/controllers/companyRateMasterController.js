import { getDb } from "../config/database.js";
import xlsx from "xlsx";

// Get all companies for franchise
export const getAllCompanies = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { search } = req.query;
    const db = getDb();

    let query = "SELECT * FROM company_rate_master WHERE franchise_id = ?";
    const params = [franchiseId];

    if (search) {
      query +=
        " AND (company_name LIKE ? OR company_id LIKE ? OR phone LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += " ORDER BY created_at DESC";

    const [companies] = await db.query(query, params);

    res.json({ success: true, data: companies });
  } catch (error) {
    console.error("Get companies error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch companies" });
  }
};

// Get single company by ID
export const getCompanyById = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [[company]] = await db.query(
      "SELECT * FROM company_rate_master WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    res.json({ success: true, data: company });
  } catch (error) {
    console.error("Get company error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch company" });
  }
};

// Create new company
export const createCompany = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const {
      company_id,
      company_name,
      company_address,
      phone,
      email,
      gst_no,
      insurance_percent,
      minimum_risk_surcharge,
      other_details,
      topay_charge,
      cod_charge,
      fuel_surcharge_percent,
      gec_fuel_surcharge_percent,
      royalty_charges_percent,
      pan_no,
      due_days,
      field_d,
      field_m,
      field_e,
      field_v,
      field_i,
      field_n,
      field_g,
      field_b,
      status = "active",
    } = req.body;

    // Validate required fields
    if (
      !company_id ||
      !company_name ||
      !company_address ||
      !phone ||
      !email ||
      !gst_no
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Company ID, Company Name, Company Address, Phone Number, Email, and GST No are required",
      });
    }

    const db = getDb();

    // Check if company_id already exists for this franchise
    const [[existing]] = await db.query(
      "SELECT id FROM company_rate_master WHERE franchise_id = ? AND company_id = ?",
      [franchiseId, company_id]
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Company ID already exists",
      });
    }

    const [result] = await db.query(
      `INSERT INTO company_rate_master 
       (franchise_id, company_id, company_name, company_address, phone, email,
        gst_no, insurance_percent, minimum_risk_surcharge, other_details,
        topay_charge, cod_charge, fuel_surcharge_percent, gec_fuel_surcharge_percent,
        royalty_charges_percent, pan_no, due_days,
        field_d, field_m, field_e, field_v, field_i, field_n, field_g, field_b, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        franchiseId,
        company_id,
        company_name,
        company_address,
        phone,
        email,
        gst_no,
        insurance_percent || 0,
        minimum_risk_surcharge || 0,
        other_details || null,
        topay_charge || 0,
        cod_charge || 0,
        fuel_surcharge_percent || 0,
        gec_fuel_surcharge_percent || 0,
        royalty_charges_percent || 0,
        pan_no || null,
        due_days || 0,
        field_d || null,
        field_m || null,
        field_e || null,
        field_v || null,
        field_i || null,
        field_n || null,
        field_g || null,
        field_b || null,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Create company error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create company" });
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const {
      company_id,
      company_name,
      company_address,
      phone,
      email,
      gst_no,
      insurance_percent,
      minimum_risk_surcharge,
      other_details,
      topay_charge,
      cod_charge,
      fuel_surcharge_percent,
      gec_fuel_surcharge_percent,
      royalty_charges_percent,
      pan_no,
      due_days,
      field_d,
      field_m,
      field_e,
      field_v,
      field_i,
      field_n,
      field_g,
      field_b,
      status,
    } = req.body;

    const db = getDb();

    // Check if company_id is being changed and if new ID already exists
    if (company_id) {
      const [[existing]] = await db.query(
        "SELECT id FROM company_rate_master WHERE franchise_id = ? AND company_id = ? AND id != ?",
        [franchiseId, company_id, id]
      );

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Company ID already exists",
        });
      }
    }

    const [result] = await db.query(
      `UPDATE company_rate_master 
       SET company_id = ?, company_name = ?, company_address = ?, phone = ?, email = ?,
           gst_no = ?, insurance_percent = ?, minimum_risk_surcharge = ?, other_details = ?,
           topay_charge = ?, cod_charge = ?, fuel_surcharge_percent = ?,
           gec_fuel_surcharge_percent = ?, royalty_charges_percent = ?, pan_no = ?,
           due_days = ?, field_d = ?, field_m = ?, field_e = ?, field_v = ?,
           field_i = ?, field_n = ?, field_g = ?, field_b = ?, status = ?
       WHERE id = ? AND franchise_id = ?`,
      [
        company_id,
        company_name,
        company_address,
        phone,
        email,
        gst_no,
        insurance_percent || 0,
        minimum_risk_surcharge || 0,
        other_details || null,
        topay_charge || 0,
        cod_charge || 0,
        fuel_surcharge_percent || 0,
        gec_fuel_surcharge_percent || 0,
        royalty_charges_percent || 0,
        pan_no || null,
        due_days || 0,
        field_d || null,
        field_m || null,
        field_e || null,
        field_v || null,
        field_i || null,
        field_n || null,
        field_g || null,
        field_b || null,
        status,
        id,
        franchiseId,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    res.json({ success: true, message: "Company updated successfully" });
  } catch (error) {
    console.error("Update company error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update company" });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [result] = await db.query(
      "DELETE FROM company_rate_master WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    res.json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    console.error("Delete company error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete company" });
  }
};

// Upload companies from Excel
export const uploadCompaniesFromExcel = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Read Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Excel file is empty" });
    }

    const db = getDb();
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Validate required fields
        if (
          !row.company_id ||
          !row.company_name ||
          !row.company_address ||
          !row.phone ||
          !row.email ||
          !row.gst_no
        ) {
          errors.push(
            `Row ${
              i + 2
            }: Missing required fields (company_id, company_name, company_address, phone, email, or gst_no)`
          );
          errorCount++;
          continue;
        }

        // Check if company_id already exists
        const [[existing]] = await db.query(
          "SELECT id FROM company_rate_master WHERE franchise_id = ? AND company_id = ?",
          [franchiseId, row.company_id]
        );

        if (existing) {
          errors.push(
            `Row ${i + 2}: Company ID '${row.company_id}' already exists`
          );
          errorCount++;
          continue;
        }

        await db.query(
          `INSERT INTO company_rate_master 
           (franchise_id, company_id, company_name, company_address, phone, email,
            gst_no, insurance_percent, minimum_risk_surcharge, other_details,
            topay_charge, cod_charge, fuel_surcharge_percent, gec_fuel_surcharge_percent,
            royalty_charges_percent, pan_no, due_days, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            franchiseId,
            row.company_id,
            row.company_name,
            row.company_address,
            row.phone,
            row.email,
            row.gst_no,
            row.insurance_percent || 0,
            row.minimum_risk_surcharge || 0,
            row.other_details || null,
            row.topay_charge || 0,
            row.cod_charge || 0,
            row.fuel_surcharge_percent || 0,
            row.gec_fuel_surcharge_percent || 0,
            row.royalty_charges_percent || 0,
            row.pan_no || null,
            row.due_days || 0,
            row.status || "active",
          ]
        );

        successCount++;
      } catch (error) {
        console.error(`Error processing row ${i + 2}:`, error);
        errors.push(`Row ${i + 2}: ${error.message}`);
        errorCount++;
      }
    }

    res.json({
      success: true,
      message: `Upload complete. ${successCount} companies imported, ${errorCount} failed.`,
      data: {
        successCount,
        errorCount,
        errors: errors.slice(0, 10), // Return first 10 errors
      },
    });
  } catch (error) {
    console.error("Upload companies error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to upload companies" });
  }
};

// Generate Excel template
export const generateCompanyTemplate = async (req, res) => {
  try {
    // Create sample data with new fields
    const sampleData = [
      {
        company_id: "ABC001",
        company_name: "ABC Corporation",
        company_address: "123 Business Street, City",
        phone: "9876543210",
        email: "abc@example.com",
        gst_no: "27AABCT1234A1Z5",
        insurance_percent: 2.5,
        minimum_risk_surcharge: 50.0,
        other_details: "Sample details",
        topay_charge: 10.0,
        cod_charge: 15.0,
        fuel_surcharge_percent: 3.5,
        gec_fuel_surcharge_percent: 2.0,
        royalty_charges_percent: 1.5,
        pan_no: "AABCT1234A",
        due_days: 30,
        status: "active",
      },
      {
        company_id: "XYZ002",
        company_name: "XYZ Logistics",
        company_address: "456 Trade Avenue, Metro City",
        phone: "9123456780",
        email: "xyz@example.com",
        gst_no: "27XYZCT5678B2Y6",
        insurance_percent: 3.0,
        minimum_risk_surcharge: 75.0,
        other_details: "Express shipping",
        topay_charge: 12.0,
        cod_charge: 18.0,
        fuel_surcharge_percent: 4.0,
        gec_fuel_surcharge_percent: 2.5,
        royalty_charges_percent: 2.0,
        pan_no: "XYZCT5678B",
        due_days: 45,
        status: "active",
      },
    ];

    // Create worksheet
    const worksheet = xlsx.utils.json_to_sheet(sampleData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Companies");

    // Generate buffer
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=company_template.xlsx"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Generate template error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate template" });
  }
};
