const express = require("express");
const router = express.Router();

const carController = require("../controllers/carController");

router.get("/cars", carController.getCars);
router.get("/cars/:id/gallery", carController.getCarGallery);
router.post("/cars", carController.addCar);
router.delete("/cars/:id", carController.deleteCar);
router.put("/cars/:id", carController.updateCar);

module.exports = router;

