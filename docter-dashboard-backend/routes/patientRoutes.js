const express = require("express");

const router = express.Router();

const {
  addPatient,
  getAllPatients,
  getPatientById,
  getMyProfile,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ===================================
// Admin & Doctor
// ===================================
router.get(
  "/",
  protect,
  roleMiddleware("admin", "doctor"),
  getAllPatients
);


// ===================================
// Patient
// ===================================

router.get(
  "/my-profile",
  protect,
  roleMiddleware("patient"),
  getMyProfile
);

router.get(
  "/:id",
  protect,
  roleMiddleware("admin", "doctor"),
  getPatientById
);

router.post(
  "/",
  protect,
  roleMiddleware("admin"),
  addPatient
);

// ===================================
// Admin Only
// ===================================
router.put(
  "/:id",
  protect,
  roleMiddleware("admin"),
  updatePatient
);

router.delete(
  "/:id",
  protect,
  roleMiddleware("admin"),
  deletePatient
);

module.exports = router;