const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET expenses
router.get("/expenses", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM expenses ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD expense
router.post("/expenses", async (req, res) => {
  try {
    const { title, amount, note } = req.body;

    const [result] = await db.query(
      "INSERT INTO expenses (title, amount, note) VALUES (?, ?, ?)",
      [title, amount, note || null]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;