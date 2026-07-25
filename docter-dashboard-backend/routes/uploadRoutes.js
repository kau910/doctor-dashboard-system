const express = require("express");

const router = express.Router();

const {
  uploadDoctorImage,
  uploadPatientImage,
  uploadPrescriptionPdf,
  uploadMedicalReport,
} = require("../controllers/uploadController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Doctor Profile Image
router.post(
  "/doctor-image",
  protect,
  roleMiddleware("doctor"),
  upload.single("image"),
  uploadDoctorImage
);

// Patient Profile Image
router.post(
  "/patient-image",
  protect,
  roleMiddleware("patient"),
  upload.single("image"),
  uploadPatientImage
);

// Prescription PDF
router.post(
  "/prescription",
  protect,
  roleMiddleware("doctor"),
  upload.single("file"),
  uploadPrescriptionPdf
);

// Medical Report
router.post(
  "/report",
  protect,
  roleMiddleware("patient", "doctor"),
  upload.single("file"),
  uploadMedicalReport
);

module.exports = router;