const User = require("../models/User");

// ======================================
// Upload Doctor Profile Image
// ======================================
const uploadDoctorImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: req.file.filename,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Doctor Profile Image Uploaded Successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Upload Patient Profile Image
// ======================================
const uploadPatientImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: req.file.filename,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Patient Profile Image Uploaded Successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Upload Prescription PDF
// ======================================
const uploadPrescriptionPdf = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "Please upload PDF",
      });

    }

    res.status(200).json({
      success: true,
      message: "Prescription Uploaded Successfully",
      file: req.file.filename,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ======================================
// Upload Medical Report
// ======================================
const uploadMedicalReport = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "Please upload Report",
      });

    }

    res.status(200).json({
      success: true,
      message: "Medical Report Uploaded Successfully",
      file: req.file.filename,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  uploadDoctorImage,
  uploadPatientImage,
  uploadPrescriptionPdf,
  uploadMedicalReport,
};