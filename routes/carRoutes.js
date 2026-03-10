const express = require("express");
const router = express.Router();

const carController = require("../controllers/carController");
const upload = require("../middleware/upload"); // IMPORTO UPLOAD

router.get("/cars", carController.getCars);
router.get("/cars/:id/gallery", carController.getCarGallery);

router.post("/cars", carController.addCar);

// KJO ËSHTË ROUTE PËR GALERI
router.post("/cars/:id/gallery", upload.array("images", 10), carController.uploadGallery);

router.delete("/cars/:id", carController.deleteCar);
router.put("/cars/:id", carController.updateCar);

module.exports = router;