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
      [imagePath, id]
    );

    res.json({
      message: "Foto u ngarkua me sukses",
      file: imagePath,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadCarGallery = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Asnje foto nuk u dergua" });
    }

    for (const file of req.files) {
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