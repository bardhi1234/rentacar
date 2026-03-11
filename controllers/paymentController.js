const db = require("../config/db");

// SHTO PAGESE
exports.addPayment = async (req, res) => {
  try {
    const { contract_id, amount, payment_method, note, payment_date } = req.body;

    if (!contract_id || !amount) {
      return res.status(400).json({
        error: "contract_id dhe amount janë të detyrueshme."
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO contract_payments
      (contract_id, amount, payment_method, note, payment_date)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        contract_id,
        amount,
        payment_method || null,
        note || null,
        payment_date || new Date().toISOString().split("T")[0]
      ]
    );

    res.json({
      message: "Pagesa u ruajt me sukses.",
      paymentId: result.insertId
    });
  } catch (error) {
    console.error("Gabim në addPayment:", error);
    res.status(500).json({ error: error.message });
  }
};

// MERR PAGESAT E NJE KONTRATE
exports.getPaymentsByContract = async (req, res) => {
  try {
    const { contractId } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM contract_payments
      WHERE contract_id = ?
      ORDER BY id DESC
      `,
      [contractId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Gabim në getPaymentsByContract:", error);
    res.status(500).json({ error: error.message });
  }
};

// TOTALI I PAGUAR PER NJE KONTRATE
exports.getPaymentSummaryByContract = async (req, res) => {
  try {
    const { contractId } = req.params;

    const [rows] = await db.query(
      `
      SELECT COALESCE(SUM(amount), 0) AS total_paid
      FROM contract_payments
      WHERE contract_id = ?
      `,
      [contractId]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("Gabim në getPaymentSummaryByContract:", error);
    res.status(500).json({ error: error.message });
  }
};