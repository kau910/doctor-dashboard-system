const express = require("express");
const router = express.Router();

const Protect = require("../middleware/authMiddleware");

const {
  downloadPrescription,
} = require("../controllers/pdfController");

// Download PDF
router.get(
  "/:id",
  Protect,
  downloadPrescription
);

module.exports = router;