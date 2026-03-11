const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/payments", paymentController.addPayment);
router.get("/payments/contract/:contractId", paymentController.getPaymentsByContract);
router.get("/payments/summary/:contractId", paymentController.getPaymentSummaryByContract);

module.exports = router;