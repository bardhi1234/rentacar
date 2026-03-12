const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL EXPENSES
router.get("/expenses", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM expenses ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Gabim në getExpenses:", error);
    res.status(500).json({ error: error.message });
  }
});

// ADD EXPENSE
router.post("/expenses", async (req, res) => {
  try {
    const { title, amount, note, expense_date } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        error: "title dhe amount janë të detyrueshme"
      });
    }

    const [result] = await db.query(
      `INSERT INTO expenses (title, amount, note, expense_date)
       VALUES (?, ?, ?, ?)`,
      [title, amount, note || null, expense_date || null]
    );

    res.status(201).json({
      message: "Shpenzimi u shtua me sukses",
      id: result.insertId
    });
  } catch (error) {
    console.error("Gabim në addExpense:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE EXPENSE
router.put("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, note, expense_date } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        error: "title dhe amount janë të detyrueshme"
      });
    }

    await db.query(
      `UPDATE expenses
       SET title = ?, amount = ?, note = ?, expense_date = ?
       WHERE id = ?`,
      [title, amount, note || null, expense_date || null, id]
    );

    res.json({ message: "Shpenzimi u përditësua me sukses" });
  } catch (error) {
    console.error("Gabim në updateExpense:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE EXPENSE
router.delete("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM expenses WHERE id = ?", [id]);

    res.json({ message: "Shpenzimi u fshi me sukses" });
  } catch (error) {
    console.error("Gabim në deleteExpense:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;