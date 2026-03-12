const express = require("express");
const router = express.Router();

const {
  getContracts,
  getContractById,
  createContract,
  addPaymentToContract,
  deleteContract,
  updateContract
} = require("../controllers/contractController");

router.get("/contracts", getContracts);
router.get("/contracts/:id", getContractById);
router.post("/contracts", createContract);
router.put("/contracts/:id", updateContract);
router.post("/contracts/:id/payment", addPaymentToContract);
router.delete("/contracts/:id", deleteContract);

module.exports = router;