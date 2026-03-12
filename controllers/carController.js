const db = require("../config/db");

// GET ALL CARS
exports.getCars = async (req, res) => {
  try {
    const [cars] = await db.query("SELECT * FROM cars ORDER BY id DESC");
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADD NEW CAR
exports.addCar = async (req, res) => {
  try {
    const {
      brand,
      model,
      full_name,
      year,
      transmission,
      fuel,
      seats,
      price_per_day,
      description,
      status
    } = req.body;

    const main_image = req.file ? req.file.filename : null;

    const [result] = await db.query(
      `INSERT INTO cars
      (brand, model, full_name, year, transmission, fuel, seats, price_per_day, description, status, main_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        brand,
        model,
        full_name,
        year,
        transmission,
        fuel,
        seats,
        price_per_day,
        description || "",
        status || "available",
        main_image
      ]
    );

    res.json({
      message: "Car added successfully",
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET CAR GALLERY
exports.getCarGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const [images] = await db.query(
      "SELECT * FROM car_gallery WHERE car_id = ? ORDER BY id DESC",
      [id]
    );

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BOOKED DATES FOR A CAR
exports.getBookedDates = async (req, res) => {
  try {
    const { id } = req.params;

    const [bookingRows] = await db.query(
      `
      SELECT pickup_date, return_date
      FROM bookings
      WHERE car_id = ? AND status = 'confirmed'
      ORDER BY pickup_date ASC
      `,
      [id]
    );

    const [contractRows] = await db.query(
      `
      SELECT pickup_date, return_date
      FROM contracts
      WHERE car_id = ?
      AND (status = 'active' OR status IS NULL OR status = '')
      ORDER BY pickup_date ASC
      `,
      [id]
    );

    const allBookedDates = [...bookingRows, ...contractRows];

    res.json(allBookedDates);
  } catch (error) {
    console.error("Gabim në getBookedDates:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE CAR
exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM cars WHERE id = ?", [id]);

    res.json({
      message: "Car deleted"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE CAR
exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      brand,
      model,
      full_name,
      year,
      transmission,
      fuel,
      seats,
      price_per_day,
      description,
      status
    } = req.body;

    const main_image = req.file ? req.file.filename : null;

    if (main_image) {
      await db.query(
        `UPDATE cars SET
          brand = ?,
          model = ?,
          full_name = ?,
          year = ?,
          transmission = ?,
          fuel = ?,
          seats = ?,
          price_per_day = ?,
          description = ?,
          status = ?,
          main_image = ?
        WHERE id = ?`,
        [
          brand,
          model,
          full_name,
          year,
          transmission,
          fuel,
          seats,
          price_per_day,
          description || "",
          status || "available",
          main_image,
          id
        ]
      );
    } else {
      await db.query(
        `UPDATE cars SET
          brand = ?,
          model = ?,
          full_name = ?,
          year = ?,
          transmission = ?,
          fuel = ?,
          seats = ?,
          price_per_day = ?,
          description = ?,
          status = ?
        WHERE id = ?`,
        [
          brand,
          model,
          full_name,
          year,
          transmission,
          fuel,
          seats,
          price_per_day,
          description || "",
          status || "available",
          id
        ]
      );
    }

    res.json({
      message: "Car updated"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};