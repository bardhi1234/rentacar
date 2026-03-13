const express = require("express");
const router = express.Router();

const carController = require("../controllers/carController");
const upload = require("../middleware/upload");

// ==================== GET ====================
router.get("/cars", carController.getCars);
router.get("/cars/:id/gallery", carController.getCarGallery);
router.get("/cars/:id/booked-dates", carController.getBookedDates);

// ==================== POST ====================
router.post("/cars", upload.single("main_image"), carController.addCar);

// ==================== PUT ====================
router.put("/cars/:id", upload.single("main_image"), carController.updateCar);

// ==================== DELETE ====================
router.delete("/cars/:id", carController.deleteCar);

module.exports = router;