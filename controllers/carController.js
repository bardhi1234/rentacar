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
      description
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO cars 
      (brand, model, full_name, year, transmission, fuel, seats, price_per_day, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [brand, model, full_name, year, transmission, fuel, seats, price_per_day, description]
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
      "SELECT * FROM car_images WHERE car_id = ? ORDER BY id DESC",
      [id]
    );

    res.json(images);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPLOAD GALLERY IMAGES
exports.uploadGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Nuk u dergua asnje foto" });
    }

    for (const file of files) {
      await db.query(
        "INSERT INTO car_images (car_id, image) VALUES (?, ?)",
        [id, file.filename]
      );
    }

    res.json({
      message: "Fotot e galerise u ngarkuan me sukses"
    });

  } catch (error) {
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
      description
    } = req.body;

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
        description = ?
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
        description,
        id
      ]
    );

    res.json({
      message: "Car updated"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};