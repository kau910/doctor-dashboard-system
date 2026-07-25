const express = require("express");

const router = express.Router();

const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// =============================
// Admin Only
// =============================
router.post(
  "/",
  protect,
  roleMiddleware("admin"),
  createDoctor
);

router.put(
  "/:id",
  protect,
  roleMiddleware("admin"),
  updateDoctor
);

router.delete(
  "/:id",
  protect,
  roleMiddleware("admin"),
  deleteDoctor
);

// =============================
// Admin & Doctor
// =============================
router.get(
  "/",
  protect,
  roleMiddleware("admin", "doctor", "patient"),
  getAllDoctors
);

router.get(
  "/:id",
  protect,
  roleMiddleware("admin", "doctor"),
  getDoctorById
);

module.exports = router;