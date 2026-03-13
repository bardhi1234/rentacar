const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "rentacar"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
}

exports.uploadCarImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Asnjë foto nuk u dërgua" });
    }

    const uploadedImage = await uploadToCloudinary(req.file.buffer);
    const imageUrl = uploadedImage.secure_url;

    await db.query(
      "UPDATE cars SET main_image = ? WHERE id = ?",
      [imageUrl, Number(id)]
    );

    res.json({
      message: "Foto u ngarkua me sukses",
      file: imageUrl
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
      return res.status(400).json({ message: "Asnjë foto nuk u dërgua" });
    }

    const carId = Number(id);

    for (const file of req.files) {
      const uploadedImage = await uploadToCloudinary(file.buffer);
      const imageUrl = uploadedImage.secure_url;

      await db.query(
        "INSERT INTO car_gallery (car_id, image) VALUES (?, ?)",
        [carId, imageUrl]
      );
    }

    res.json({
      message: "Fotot e galerisë u ngarkuan me sukses"
    });
  } catch (error) {
    console.error("Upload gallery error:", error);
    res.status(500).json({ error: error.message });
  }
};