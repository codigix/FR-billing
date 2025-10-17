import { getDb } from "../config/database.js";

export const getSectorsByFranchise = async (req, res) => {
  try {
    const { franchiseId } = req.params;
    const db = getDb();

    const [sectors] = await db.query(
      "SELECT * FROM franchise_sectors WHERE franchise_id = ? ORDER BY priority_sequence ASC, id ASC",
      [franchiseId]
    );

    res.json({
      success: true,
      data: sectors,
    });
  } catch (error) {
    console.error("Get sectors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sectors",
    });
  }
};

export const saveSectors = async (req, res) => {
  try {
    const { franchiseId } = req.params;
    const { sectors } = req.body;

    if (!Array.isArray(sectors)) {
      return res.status(400).json({
        success: false,
        message: "Sectors must be an array",
      });
    }

    const db = getDb();

    // Begin transaction
    await db.query("START TRANSACTION");

    try {
      // Delete existing sectors for this franchise
      await db.query("DELETE FROM franchise_sectors WHERE franchise_id = ?", [
        franchiseId,
      ]);

      // Insert new sectors
      for (let i = 0; i < sectors.length; i++) {
        const sector = sectors[i];

        await db.query(
          `INSERT INTO franchise_sectors 
          (franchise_id, sector_name, pincodes, dox, nondox_air, nondox_sur, 
           express_cargo, priority, ecom_priority, ecom_ge, priority_sequence) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            franchiseId,
            sector.sector_name || "",
            sector.pincodes || "",
            sector.dox || false,
            sector.nondox_air || false,
            sector.nondox_sur || false,
            sector.express_cargo || false,
            sector.priority || false,
            sector.ecom_priority || false,
            sector.ecom_ge || false,
            i + 1,
          ]
        );
      }

      await db.query("COMMIT");

      res.json({
        success: true,
        message: "Sectors saved successfully",
      });
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Save sectors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save sectors",
    });
  }
};

export const deleteSector = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();

    await db.query("DELETE FROM franchise_sectors WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Sector deleted successfully",
    });
  } catch (error) {
    console.error("Delete sector error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete sector",
    });
  }
};
