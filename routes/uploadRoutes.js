const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  uploadCarImage,
  uploadCarGallery
} = require("../controllers/uploadController");

router.post("/cars/:id/upload", upload.single("image"), uploadCarImage);
router.post("/cars/:id/gallery", upload.array("images", 10), uploadCarGallery);

module.exports = router;