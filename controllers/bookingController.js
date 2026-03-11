const db = require("../config/db");

// GET ALL BOOKINGS
exports.getBookings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        bookings.*,
        cars.full_name AS car_name
      FROM bookings
      LEFT JOIN cars ON bookings.car_id = cars.id
      ORDER BY bookings.id DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADD BOOKING
exports.addBooking = async (req, res) => {
  try {
    const {
      car_id,
      pickup_date,
      return_date,
      pickup_location,
      customer_name,
      customer_phone,
      status
    } = req.body;

    if (!car_id || !pickup_date || !return_date) {
      return res.status(400).json({
        error: "car_id, pickup_date dhe return_date janë të detyrueshme."
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO bookings
      (car_id, pickup_date, return_date, pickup_location, customer_name, customer_phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        car_id,
        pickup_date,
        return_date,
        pickup_location || "",
        customer_name || "",
        customer_phone || "",
        status || "confirmed"
      ]
    );

    res.json({
      message: "Booking u shtua me sukses",
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE BOOKING
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      car_id,
      pickup_date,
      return_date,
      pickup_location,
      customer_name,
      customer_phone,
      status
    } = req.body;

    if (!car_id || !pickup_date || !return_date) {
      return res.status(400).json({
        error: "car_id, pickup_date dhe return_date janë të detyrueshme."
      });
    }

    await db.query(
      `
      UPDATE bookings SET
        car_id = ?,
        pickup_date = ?,
        return_date = ?,
        pickup_location = ?,
        customer_name = ?,
        customer_phone = ?,
        status = ?
      WHERE id = ?
      `,
      [
        car_id,
        pickup_date,
        return_date,
        pickup_location || "",
        customer_name || "",
        customer_phone || "",
        status || "confirmed",
        id
      ]
    );

    res.json({
      message: "Booking u përditësua me sukses"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE BOOKING
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM bookings WHERE id = ?", [id]);

    res.json({
      message: "Booking u fshi me sukses"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};