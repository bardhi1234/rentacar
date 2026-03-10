const db = require("../config/db");

exports.getCars = async (req, res) => {
  try {
    const [cars] = await db.query("SELECT * FROM cars ORDER BY id DESC");
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addCar = async (req, res) => {
  try {
    let {
      brand,
      model,
      full_name,
      year,
      transmission,
      fuel,
      seats,
      price_per_day,
      description,
      status,
      main_image
    } = req.body;

    brand = brand ? brand.trim() : "";
    model = model ? model.trim() : "";
    full_name = full_name ? full_name.trim() : "";
    transmission = transmission ? transmission.trim() : "";
    fuel = fuel ? fuel.trim() : "";
    description = description ? description.trim() : "";
    status = status ? status.trim() : "available";
    main_image = main_image ? main_image.trim() : null;

    if (
      !brand ||
      !model ||
      !full_name ||
      !year ||
      !transmission ||
      !fuel ||
      !seats ||
      !price_per_day
    ) {
      return res.status(400).json({
        message: "Të gjitha fushat kryesore janë të detyrueshme"
      });
    }

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
        description,
        status,
        main_image
      ]
    );

    res.json({ message: "Car added successfully", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM cars WHERE id = ?", [id]);

    res.json({ message: "Car deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    let {
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

    brand = brand ? brand.trim() : "";
    model = model ? model.trim() : "";
    full_name = full_name ? full_name.trim() : "";
    transmission = transmission ? transmission.trim() : "";
    fuel = fuel ? fuel.trim() : "";
    description = description ? description.trim() : "";
    status = status ? status.trim() : "available";

    if (
      !brand ||
      !model ||
      !full_name ||
      !year ||
      !transmission ||
      !fuel ||
      !seats ||
      !price_per_day
    ) {
      return res.status(400).json({
        message: "Të gjitha fushat kryesore janë të detyrueshme"
      });
    }

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
        description,
        status,
        id
      ]
    );

    res.json({ message: "Car updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};