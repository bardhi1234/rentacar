const express = require("express");
const router = express.Router();

const carController = require("../controllers/carController");
const upload = require("../middleware/upload");

router.get("/cars", carController.getCars);
router.get("/cars/:id/gallery", carController.getCarGallery);

router.post("/cars", upload.single("main_image"), carController.addCar);
router.post("/cars/:id/gallery", upload.array("images", 10), carController.uploadGallery);

router.delete("/cars/:id", carController.deleteCar);
router.put("/cars/:id", upload.single("main_image"), carController.updateCar);

module.exports = router;