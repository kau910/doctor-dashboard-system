const express = require("express");

const router = express.Router();

const {
  bookAppointment,
  getAllAppointments,
  getAppointmentById,
  getMyAppointments,
  getDoctorAppointments,
  approveAppointment,
  rejectAppointment,
  completeAppointment,
  cancelAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// =======================================
// Patient
// =======================================

// Book Appointment
router.post(
  "/book",
  protect,
  roleMiddleware("patient"),
  bookAppointment
);

// My Appointments
router.get(
  "/my-appointments",
  protect,
  roleMiddleware("patient"),
  getMyAppointments
);

// Cancel Appointment
router.put(
  "/cancel/:id",
  protect,
  roleMiddleware("patient"),
  cancelAppointment
);

// =======================================
// Doctor
// =======================================

// Doctor Appointments
router.get(
  "/doctor",
  protect,
  roleMiddleware("doctor"),
  getDoctorAppointments
);

// Approve Appointment
router.put(
  "/approve/:id",
  protect,
  roleMiddleware("doctor"),
  approveAppointment
);

// Reject Appointment
router.put(
  "/reject/:id",
  protect,
  roleMiddleware("doctor"),
  rejectAppointment
);

// Complete Appointment
router.put(
  "/complete/:id",
  protect,
  roleMiddleware("doctor"),
  completeAppointment
);

// =======================================
// Admin
// =======================================

// Get All Appointments
router.get(
  "/",
  protect,
  roleMiddleware("admin"),
  getAllAppointments
);

// Get Single Appointment
router.get(
  "/:id",
  protect,
  roleMiddleware("admin"),
  getAppointmentById
);

// Delete Appointment
router.delete(
  "/:id",
  protect,
  roleMiddleware("admin"),
  deleteAppointment
);

module.exports = router;