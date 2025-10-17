import { getDb } from "../config/database.js";

// Get all available invoice data columns
export const getInvoiceDataColumns = async (req, res) => {
  try {
    const columns = [
      { value: "sr_no", label: "Sr. No" },
      { value: "consignment_no", label: "Consignment No" },
      { value: "customer_id", label: "Customer ID" },
      { value: "booking_date", label: "Booking Date" },
      { value: "amount", label: "Amount" },
      { value: "invoice_date", label: "Invoice Date" },
      { value: "gst_amount", label: "GST Amount" },
      { value: "net_amount", label: "Net Amount" },
      { value: "payment_status", label: "Payment Status" },
    ];

    res.json({
      success: true,
      data: {
        columns: columns,
      },
    });
  } catch (error) {
    console.error("Error fetching invoice data columns:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice data columns",
    });
  }
};

// Get franchise settings
export const getSettings = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const db = getDb();

    const [franchises] = await db.query(
      "SELECT * FROM franchises WHERE id = ?",
      [franchiseId]
    );

    const franchise = franchises[0];

    if (!franchise) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    const settings = {
      invoice_round_off: franchise.invoice_round_off || false,
      invoice_start_from: franchise.invoice_start_from || 1,
      show_image_on_invoice: franchise.show_image_on_invoice !== false,
      invoice_year: franchise.invoice_year || "current",
      invoice_data_to_hide: franchise.invoice_data_to_hide
        ? JSON.parse(franchise.invoice_data_to_hide)
        : [],
    };

    res.json({
      success: true,
      data: {
        franchiseCode: franchise.code,
        franchiseName: franchise.name,
        settings: settings,
      },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

// Update franchise settings
export const updateSettings = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const db = getDb();
    const {
      invoice_round_off,
      invoice_start_from,
      show_image_on_invoice,
      invoice_year,
      invoice_data_to_hide,
    } = req.body;

    // Validate inputs
    if (
      invoice_start_from &&
      (isNaN(invoice_start_from) || invoice_start_from < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invoice Start From must be a valid number greater than 0",
      });
    }

    const updateData = {
      invoice_round_off:
        invoice_round_off === true || invoice_round_off === "Yes",
      invoice_start_from: parseInt(invoice_start_from) || 1,
      show_image_on_invoice:
        show_image_on_invoice === true || show_image_on_invoice === "Yes",
      invoice_year: invoice_year || "current",
      invoice_data_to_hide: JSON.stringify(invoice_data_to_hide || []),
      settings_updated_at: new Date(),
    };

    await db.query("UPDATE franchises SET ? WHERE id = ?", [
      updateData,
      franchiseId,
    ]);

    const [updatedFranchises] = await db.query(
      "SELECT * FROM franchises WHERE id = ?",
      [franchiseId]
    );

    const updatedFranchise = updatedFranchises[0];

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: {
        settings: {
          invoice_round_off: updatedFranchise.invoice_round_off,
          invoice_start_from: updatedFranchise.invoice_start_from,
          show_image_on_invoice: updatedFranchise.show_image_on_invoice,
          invoice_year: updatedFranchise.invoice_year,
          invoice_data_to_hide: JSON.parse(
            updatedFranchise.invoice_data_to_hide
          ),
        },
      },
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};
