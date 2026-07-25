const express = require("express");

const router = express.Router();

const {
  getAvailableSlots,
} = require("../controllers/slotController");

const protect = require("../middleware/authMiddleware");

// Anyone Logged In
router.get(
  "/available",
  protect,
  getAvailableSlots
);

module.exports = router;