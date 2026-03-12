const db = require("../config/db");

// GET ALL CONTRACTS
exports.getContracts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT contracts.*, cars.full_name AS car_name
      FROM contracts
      LEFT JOIN cars ON contracts.car_id = cars.id
      ORDER BY contracts.id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Gabim në getContracts:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE CONTRACT
exports.getContractById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT contracts.*, cars.full_name AS car_name
      FROM contracts
      LEFT JOIN cars ON contracts.car_id = cars.id
      WHERE contracts.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Kontrata nuk u gjet." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Gabim në getContractById:", error);
    res.status(500).json({ error: error.message });
  }
};

// CREATE CONTRACT
exports.createContract = async (req, res) => {
  try {
    const {
      contract_number,
      car_id,
      customer_name,
      birth_date,
      personal_number,
      address,
      phone,
      pickup_date,
      pickup_time,
      return_date,
      return_time,
      price_per_day,
      total_days,
      total_price,
      paid_amount,
      remaining_amount,
      payment_method
    } = req.body;

    if (!contract_number || !car_id || !customer_name || !pickup_date || !return_date) {
      return res.status(400).json({
        error: "contract_number, car_id, customer_name, pickup_date dhe return_date janë të detyrueshme."
      });
    }

    const createdAt = new Date();

    const [result] = await db.query(`
      INSERT INTO contracts (
        contract_number,
        car_id,
        customer_name,
        birth_date,
        personal_number,
        address,
        phone,
        pickup_date,
        pickup_time,
        return_date,
        return_time,
        price_per_day,
        total_days,
        total_price,
        paid_amount,
        remaining_amount,
        created_at,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      contract_number,
      car_id,
      customer_name,
      birth_date || null,
      personal_number || null,
      address || null,
      phone || null,
      pickup_date,
      pickup_time || null,
      return_date,
      return_time || null,
      price_per_day || 0,
      total_days || 1,
      total_price || 0,
      paid_amount || 0,
      remaining_amount || 0,
      createdAt,
      "active"
    ]);

    if (paid_amount && Number(paid_amount) > 0) {
      await db.query(`
        INSERT INTO contract_payments (
          contract_id,
          amount,
          payment_method,
          note,
          payment_date
        )
        VALUES (?, ?, ?, ?, ?)
      `, [
        result.insertId,
        paid_amount,
        payment_method || "cash",
        "Pagesa fillestare e kontratës",
        pickup_date
      ]);
    }

    await db.query(
      `UPDATE cars SET status = 'rented' WHERE id = ?`,
      [car_id]
    );

    res.status(201).json({
      message: "Kontrata u krijua me sukses.",
      contract_id: result.insertId
    });
  } catch (error) {
    console.error("Gabim në createContract:", error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE CONTRACT
exports.updateContract = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      customer_name,
      birth_date,
      personal_number,
      address,
      phone,
      pickup_date,
      pickup_time,
      return_date,
      return_time,
      price_per_day,
      total_days,
      total_price,
      paid_amount,
      remaining_amount
    } = req.body;

    const [rows] = await db.query(
      `SELECT * FROM contracts WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Kontrata nuk u gjet." });
    }

    await db.query(
      `
      UPDATE contracts
      SET
        customer_name = ?,
        birth_date = ?,
        personal_number = ?,
        address = ?,
        phone = ?,
        pickup_date = ?,
        pickup_time = ?,
        return_date = ?,
        return_time = ?,
        price_per_day = ?,
        total_days = ?,
        total_price = ?,
        paid_amount = ?,
        remaining_amount = ?
      WHERE id = ?
      `,
      [
        customer_name || null,
        birth_date || null,
        personal_number || null,
        address || null,
        phone || null,
        pickup_date || null,
        pickup_time || null,
        return_date || null,
        return_time || null,
        price_per_day || 0,
        total_days || 1,
        total_price || 0,
        paid_amount || 0,
        remaining_amount || 0,
        id
      ]
    );

    res.json({ message: "Kontrata u përditësua me sukses." });
  } catch (error) {
    console.error("Gabim në updateContract:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE CONTRACT
exports.deleteContract = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM contracts WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Kontrata nuk u gjet." });
    }

    const contract = rows[0];

    await db.query(
      `DELETE FROM contract_payments WHERE contract_id = ?`,
      [id]
    );

    await db.query(
      `DELETE FROM contracts WHERE id = ?`,
      [id]
    );

    await db.query(
      `UPDATE cars SET status = 'available' WHERE id = ?`,
      [contract.car_id]
    );

    res.json({ message: "Kontrata u fshi me sukses." });
  } catch (error) {
    console.error("Gabim në deleteContract:", error);
    res.status(500).json({ error: error.message });
  }
};

// ADD PAYMENT TO CONTRACT
exports.addPaymentToContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, payment_method, note, payment_date } = req.body;

    if (!amount || !payment_date) {
      return res.status(400).json({
        error: "amount dhe payment_date janë të detyrueshme."
      });
    }

    const [contractRows] = await db.query(
      `SELECT * FROM contracts WHERE id = ?`,
      [id]
    );

    if (contractRows.length === 0) {
      return res.status(404).json({ error: "Kontrata nuk u gjet." });
    }

    const contract = contractRows[0];

    await db.query(`
      INSERT INTO contract_payments (
        contract_id,
        amount,
        payment_method,
        note,
        payment_date
      )
      VALUES (?, ?, ?, ?, ?)
    `, [
      id,
      amount,
      payment_method || "cash",
      note || "Pagesë shtesë",
      payment_date
    ]);

    const newPaidAmount = Number(contract.paid_amount) + Number(amount);
    const newRemainingAmount = Number(contract.total_price) - newPaidAmount;

    await db.query(`
      UPDATE contracts
      SET paid_amount = ?, remaining_amount = ?
      WHERE id = ?
    `, [
      newPaidAmount,
      newRemainingAmount,
      id
    ]);

    res.json({ message: "Pagesa u shtua me sukses." });
  } catch (error) {
    console.error("Gabim në addPaymentToContract:", error);
    res.status(500).json({ error: error.message });
  }
};