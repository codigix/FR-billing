import { getDb } from "../config/database.js";

export const getAllRates = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { service_type, search } = req.query;
    const db = getDb();

    let whereClause = "WHERE franchise_id = ?";
    const params = [franchiseId];

    if (service_type) {
      whereClause += " AND service_type = ?";
      params.push(service_type);
    }

    if (search) {
      whereClause += " AND (from_pincode LIKE ? OR to_pincode LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    const [rates] = await db.query(
      `SELECT * FROM rate_master 
       ${whereClause}
       ORDER BY service_type, weight_from`,
      params
    );

    res.json({ success: true, data: rates });
  } catch (error) {
    console.error("Get rates error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch rates" });
  }
};

export const getRateById = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [[rate]] = await db.query(
      "SELECT * FROM rate_master WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (!rate) {
      return res
        .status(404)
        .json({ success: false, message: "Rate not found" });
    }

    res.json({ success: true, data: rate });
  } catch (error) {
    console.error("Get rate error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch rate" });
  }
};

export const calculateRate = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { from_pincode, to_pincode, weight, service_type } = req.body;
    const db = getDb();

    const [[rate]] = await db.query(
      `SELECT * FROM rate_master 
       WHERE franchise_id = ? 
       AND (from_pincode = ? OR from_pincode = '*')
       AND (to_pincode = ? OR to_pincode = '*')
       AND service_type = ?
       AND weight_from <= ?
       AND (weight_to >= ? OR weight_to IS NULL)
       ORDER BY 
         CASE WHEN from_pincode = ? THEN 0 ELSE 1 END,
         CASE WHEN to_pincode = ? THEN 0 ELSE 1 END
       LIMIT 1`,
      [
        franchiseId,
        from_pincode,
        to_pincode,
        service_type,
        weight,
        weight,
        from_pincode,
        to_pincode,
      ]
    );

    if (!rate) {
      return res.status(404).json({
        success: false,
        message: "No matching rate found for given parameters",
      });
    }

    const totalAmount = rate.rate_per_kg * weight;

    res.json({
      success: true,
      data: {
        rate: rate.rate_per_kg,
        weight,
        total_amount: totalAmount,
        service_type,
      },
    });
  } catch (error) {
    console.error("Calculate rate error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to calculate rate" });
  }
};

export const createRate = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const {
      from_pincode,
      to_pincode,
      service_type,
      weight_from,
      weight_to,
      rate_per_kg,
    } = req.body;
    const db = getDb();

    const [result] = await db.query(
      `INSERT INTO rate_master 
       (franchise_id, from_pincode, to_pincode, service_type, weight_from, weight_to, rate_per_kg)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        franchiseId,
        from_pincode,
        to_pincode,
        service_type,
        weight_from,
        weight_to || null,
        rate_per_kg,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Rate created successfully",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Create rate error:", error);
    res.status(500).json({ success: false, message: "Failed to create rate" });
  }
};

export const updateRate = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const {
      from_pincode,
      to_pincode,
      service_type,
      weight_from,
      weight_to,
      rate_per_kg,
    } = req.body;
    const db = getDb();

    const [result] = await db.query(
      `UPDATE rate_master 
       SET from_pincode = ?, to_pincode = ?, service_type = ?, 
           weight_from = ?, weight_to = ?, rate_per_kg = ?
       WHERE id = ? AND franchise_id = ?`,
      [
        from_pincode,
        to_pincode,
        service_type,
        weight_from,
        weight_to || null,
        rate_per_kg,
        id,
        franchiseId,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Rate not found" });
    }

    res.json({ success: true, message: "Rate updated successfully" });
  } catch (error) {
    console.error("Update rate error:", error);
    res.status(500).json({ success: false, message: "Failed to update rate" });
  }
};

export const deleteRate = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [result] = await db.query(
      "DELETE FROM rate_master WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Rate not found" });
    }

    res.json({ success: true, message: "Rate deleted successfully" });
  } catch (error) {
    console.error("Delete rate error:", error);
    res.status(500).json({ success: false, message: "Failed to delete rate" });
  }
};
