const bcrypt = require("bcryptjs");
const Patient = require("../models/Patient");
const User = require("../models/User");
const ApiFeatures = require("../utils/apiFeatures");

// ================================
// Get All Patients
// ================================

const addPatient = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      age,
      bloodGroup,
      height,
      weight,
      address,
      emergencyContact,
    } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      gender,
      role: "patient",
    });

    const patient = await Patient.create({
      userId: user._id,
      dateOfBirth,
      age,
      gender,
      bloodGroup,
      height,
      weight,
      address,
      emergencyContact,
    });

    res.status(201).json({
      success: true,
      message: "Patient Added Successfully",
      patient,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getAllPatients = async (req, res) => {
  try {

    const apiFeatures = new ApiFeatures(
      Patient.find().populate("userId", "-password"),
      req.query
    )
      .filter()
      .sort()
      .paginate(10);

    const patients = await apiFeatures.query;

    const totalPatients = await Patient.countDocuments();

    res.status(200).json({
      success: true,
      totalPatients,
      currentPage: Number(req.query.page) || 1,
      resultPerPage: 10,
      count: patients.length,
      patients,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================================
// Get Single Patient
// ================================
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("userId", "-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient Not Found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// My Profile (Patient)
// ================================
const getMyProfile = async (req, res) => {

  try {

    const patient = await Patient.findOne({
      userId: req.user._id,
    }).populate("userId", "-password");

    if (!patient) {

      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });

    }

    res.status(200).json({
      success: true,
      patient,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================================
// Update Patient
// ================================
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient Updated Successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// Delete Patient
// ================================
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient Not Found",
      });
    }

    await User.findByIdAndDelete(patient.userId);
    await patient.deleteOne();

    res.status(200).json({
      success: true,
      message: "Patient Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addPatient,
  getAllPatients,
  getPatientById,
  getMyProfile,
  updatePatient,
  deletePatient,
};