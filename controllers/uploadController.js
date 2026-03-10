const db = require("../config/db");

exports.uploadCarImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Asnje foto nuk u dergua" });
    }

    const imagePath = req.file.filename;

    await db.query(
      "UPDATE cars SET main_image = ? WHERE id = ?",
      [imagePath, Number(id)]
    );

    res.json({
      message: "Foto u ngarkua me sukses",
      file: imagePath,
    });
  } catch (error) {
    console.error("Upload main image error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.uploadCarGallery = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Asnje foto nuk u dergua" });
    }

    const carId = Number(id);

    for (const file of req.files) {
      const [rows] = await db.query(
        "SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM car_images"
      );

      const nextId = rows[0].nextId;

      await db.query(
  "INSERT INTO car_gallery (car_id, image) VALUES (?, ?)",
  [carId, file.filename]
);
    }

    res.json({
      message: "Fotot e galerise u ngarkuan me sukses"
    });
  } catch (error) {
    console.error("Upload gallery error:", error);
    res.status(500).json({ error: error.message });
  }
};