const express = require("express");
const router = express.Router();
const {
  getContracts,
  getContractById,
  createContract,
  addPaymentToContract,
  deleteContract
} = require("../controllers/contractController");

router.get("/contracts", getContracts);
router.get("/contracts/:id", getContractById);
router.post("/contracts", createContract);
router.post("/contracts/:id/payment", addPaymentToContract);
router.delete("/contracts/:id", deleteContract);
router.put("/contracts/:id", updateContract);

module.exports = router;

