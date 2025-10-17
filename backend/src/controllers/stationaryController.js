import { getDb } from "../config/database.js";

export const getAllStationary = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { search } = req.query;
    const db = getDb();

    let whereClause = "WHERE franchise_id = ?";
    const params = [franchiseId];

    if (search) {
      whereClause += " AND item_name LIKE ?";
      params.push(`%${search}%`);
    }

    const [items] = await db.query(
      `SELECT * FROM stationary ${whereClause} ORDER BY item_name`,
      params
    );

    res.json({ success: true, data: items });
  } catch (error) {
    console.error("Get stationary error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch stationary items" });
  }
};

export const getStationaryById = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [[item]] = await db.query(
      "SELECT * FROM stationary WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Stationary item not found" });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error("Get stationary error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch stationary item" });
  }
};

export const createStationary = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { item_name, quantity, unit_price } = req.body;
    const db = getDb();

    const [result] = await db.query(
      `INSERT INTO stationary (franchise_id, item_name, quantity, unit_price)
       VALUES (?, ?, ?, ?)`,
      [franchiseId, item_name, quantity, unit_price]
    );

    res.status(201).json({
      success: true,
      message: "Stationary item created successfully",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Create stationary error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create stationary item" });
  }
};

export const updateStationary = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const { item_name, quantity, unit_price } = req.body;
    const db = getDb();

    const [result] = await db.query(
      `UPDATE stationary 
       SET item_name = ?, quantity = ?, unit_price = ?
       WHERE id = ? AND franchise_id = ?`,
      [item_name, quantity, unit_price, id, franchiseId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Stationary item not found" });
    }

    res.json({
      success: true,
      message: "Stationary item updated successfully",
    });
  } catch (error) {
    console.error("Update stationary error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update stationary item" });
  }
};

export const deleteStationary = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const db = getDb();

    const [result] = await db.query(
      "DELETE FROM stationary WHERE id = ? AND franchise_id = ?",
      [id, franchiseId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Stationary item not found" });
    }

    res.json({
      success: true,
      message: "Stationary item deleted successfully",
    });
  } catch (error) {
    console.error("Delete stationary error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete stationary item" });
  }
};

export const adjustStock = async (req, res) => {
  try {
    const franchiseId = req.user.franchise_id;
    const { id } = req.params;
    const { adjustment } = req.body; // positive or negative number
    const db = getDb();

    const [result] = await db.query(
      `UPDATE stationary 
       SET quantity = quantity + ?
       WHERE id = ? AND franchise_id = ?`,
      [adjustment, id, franchiseId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Stationary item not found" });
    }

    res.json({ success: true, message: "Stock adjusted successfully" });
  } catch (error) {
    console.error("Adjust stock error:", error);
    res.status(500).json({ success: false, message: "Failed to adjust stock" });
  }
};
