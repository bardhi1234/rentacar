const db = require("../config/db");

// GET ALL EXPENSES
exports.getExpenses = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM expenses ORDER BY id DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error("Gabim në getExpenses:", error);
    res.status(500).json({ error: error.message });
  }
};

// ADD EXPENSE
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, note } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        error: "title dhe amount janë të detyrueshme"
      });
    }

    const [result] = await db.query(
      `INSERT INTO expenses (title, amount, note)
       VALUES (?, ?, ?)`,
      [title, amount, note || null]
    );

    res.status(201).json({
      message: "Shpenzimi u shtua",
      id: result.insertId
    });

  } catch (error) {
    console.error("Gabim në addExpense:", error);
    res.status(500).json({ error: error.message });
  }
};