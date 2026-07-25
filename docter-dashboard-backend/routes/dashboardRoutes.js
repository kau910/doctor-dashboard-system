const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getRecentAppointments,
  getTodayAppointments,
  getDoctorDashboard,
  getPatientDashboard,
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// =====================================
// Dashboard Statistics
// =====================================
router.get(
  "/stats",
  protect,
  roleMiddleware("admin"),
  getDashboardStats
);



// =====================================
// Recent Appointments
// =====================================
router.get(
  "/recent",
  protect,
  roleMiddleware("admin"),
  getRecentAppointments
);

// =====================================
// Today's Appointments
// =====================================
router.get(
  "/today",
  protect,
  roleMiddleware("admin"),
  getTodayAppointments
);

router.get(
  "/doctor",
  protect,
  roleMiddleware("doctor"),
  getDoctorDashboard
);

router.get(
  "/patient",
  protect,
  roleMiddleware("patient"),
  getPatientDashboard
);

module.exports = router;