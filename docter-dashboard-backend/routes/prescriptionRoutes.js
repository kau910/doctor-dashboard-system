const express = require("express");

const router = express.Router();

const {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  downloadPrescription,
   getMyPrescriptions,
} = require("../controllers/prescriptionController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ======================================
// Doctor
// ======================================

// Create Prescription
router.post(
  "/",
  protect,
  roleMiddleware("doctor"),
  createPrescription
);

// Update Prescription
router.put(
  "/:id",
  protect,
  roleMiddleware("doctor"),
  updatePrescription
);

// ======================================
// Patient
// ======================================

// My Prescriptions

router.get(

  "/my-prescriptions",

  protect,

  roleMiddleware("patient"),

  getMyPrescriptions

);

// ======================================
// Admin & Doctor
// ======================================

// Get All Prescriptions
router.get(
  "/",
  protect,
  roleMiddleware("admin", "doctor"),
  getAllPrescriptions
);

// Get Prescription By Id
router.get(
  "/:id",
  protect,
  roleMiddleware("admin", "doctor"),
  getPrescriptionById
);

// ======================================
// Admin
// ======================================

// Delete Prescription
router.delete(
  "/:id",
  protect,
  roleMiddleware("admin"),
  deletePrescription
);

router.get(

"/download/:id",

protect,

roleMiddleware("doctor","patient","admin"),

downloadPrescription

);

module.exports = router;