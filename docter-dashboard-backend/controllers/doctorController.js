const Doctor = require("../models/Doctor");
const User = require("../models/User");
const ApiFeatures = require("../utils/apiFeatures");
const bcrypt = require("bcryptjs");

// ================================
// Add Doctor (Admin)
// ================================
exports.createDoctor = async (req, res) => {

  try {

    const {
      fullName,
      email,
      password,
      phone,
      gender,
      specialization,
      qualification,
      experience,
      consultationFee,
      availableDays,
      availableTime,
      department,
      about,
      profileImage,
    } = req.body;

    // Validation

    if (
      !fullName ||
      !email ||
      !password ||
      !phone ||
      !gender
    ) {

      return res.status(400).json({

        success: false,

        message: "Please fill all required fields.",

      });

    }

    // Check Existing Email

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {

      return res.status(400).json({

        success: false,

        message: "Email already exists.",

      });

    }

    // Hash Password

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create User

   const user = await User.create({
  fullName,
  email,
  password, // <-- hashedPassword mat bhejo
  phone,
  gender,
  role: "doctor",
});

console.log("USER CREATED:", user);
console.log("USER ID:", user._id);

if (!user || !user._id) {
  return res.status(400).json({
    success: false,
    message: "User creation failed",
  });
}
        // Create Doctor Profile

    const doctor = await Doctor.create({

      userId: user._id,

      specialization:
        specialization || "General Physician",

      qualification:
        qualification || "Not Updated",

      experience:
        experience || 0,

      consultationFee:
        consultationFee || 0,

      availableDays:
        availableDays || [],

      availableTime:
        availableTime || {
          start: "09:00",
          end: "17:00",
        },

      department:
        department || "General",

      about:
        about || "",

      profileImage:
        profileImage || "",

    });

    res.status(201).json({

      success: true,

      message: "Doctor Added Successfully",

      doctor,

      user: {

        id: user._id,

        fullName: user.fullName,

        email: user.email,

        role: user.role,

      },

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
// ================================
// Get All Doctors
// ================================
exports.getAllDoctors = async (req, res) => {
  try {

    const apiFeatures = new ApiFeatures(
      Doctor.find().populate("userId", "-password"),
      req.query
    )
      .search(["specialization", "department", "qualification"])
      .filter()
      .sort()
      .paginate(10);

    const doctors = await apiFeatures.query;

    const totalDoctors = await Doctor.countDocuments();

    res.status(200).json({
      success: true,
      totalDoctors,
      currentPage: Number(req.query.page) || 1,
      resultPerPage: 10,
      count: doctors.length,
      doctors,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ================================
// Get Single Doctor
// ================================
exports.getDoctorById = async (req, res) => {

  try {

    const doctor = await Doctor.findById(req.params.id)
      .populate("userId", "-password");

    if (!doctor) {

      return res.status(404).json({
        success: false,
        message: "Doctor Not Found",
      });

    }

    res.status(200).json({
      success: true,
      doctor,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================================
// Update Doctor
// ================================
exports.updateDoctor = async (req, res) => {

  try {

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {

      return res.status(404).json({
        success: false,
        message: "Doctor Not Found",
      });

    }

    res.status(200).json({
      success: true,
      message: "Doctor Updated Successfully",
      doctor,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================================
// Delete Doctor
// ================================
exports.deleteDoctor = async (req, res) => {

  try {

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {

      return res.status(404).json({
        success: false,
        message: "Doctor Not Found",
      });

    }

    await User.findByIdAndDelete(doctor.userId);
    await doctor.deleteOne();

    res.status(200).json({
      success: true,
      message: "Doctor Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};