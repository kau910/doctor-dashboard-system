const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const sendEmail = require("../utils/sendEmail");

const generateToken = require("../utils/generateToken");

// ==========================================
// Register User
// ==========================================

const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      gender,
      role,
    } = req.body;

    // Validation
    if (
      !fullName ||
      !email ||
      !password ||
      !phone ||
      !gender ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Email Exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // Create User
    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      gender,
      role,
    });

    // Doctor Profile
    if (role === "doctor") {
      await Doctor.create({
        userId: user._id,
        specialization: "",
        qualification: "",
        experience: 0,
        consultationFee: 0,
        availableDays: [],
        availableTime: {
          start: "09:00",
          end: "05:00",
        },
        department: "",
        about: "",
      });
    }

    // Patient Profile
    if (role === "patient") {
      await Patient.create({
        userId: user._id,
        dateOfBirth: new Date(),
        age: 0,
        gender,
        bloodGroup: "O+",
        height: 0,
        weight: 0,
        address: "",
        emergencyContact: "",
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
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



// ==========================================
// Login User
// ==========================================

const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });

    }

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "Invalid Email or Password.",
      });

    }

    if (!user.isActive) {

      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });

    }

    const isMatch =
      await user.matchPassword(password);

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password.",
      });

    }

    const token =
      generateToken(user._id, user.role);

    res.status(200).json({

      success: true,

      message: "Login successful.",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
        profileImage: user.profileImage,
      },

    });

  } catch (error) {
   console.log("=================================");
  console.log(error);
  console.log(error.stack);
  console.log("=================================");

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

const bcrypt = require("bcryptjs");

// ==========================================
// Get Profile
// ==========================================

const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ==========================================
// Update Profile
// ==========================================

const updateProfile = async (req, res) => {

  try {

    const {
      fullName,
      phone,
      gender,
      profileImage,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    }

    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    user.profileImage =
      profileImage || user.profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// ==========================================
// Change Password
// ==========================================

const changePassword = async (req, res) => {

  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });

    }

    if (newPassword !== confirmPassword) {

      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });

    }

    const user = await User.findById(req.user._id);

    const isMatch =
      await user.matchPassword(currentPassword);

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });

    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

const crypto = require("crypto");

// ==========================================
// Logout
// ==========================================

const logoutUser = async (req, res) => {

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });

};



// ==========================================
// Forgot Password
// ==========================================

const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });

    }

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    }

    const otp =
      Math.floor(100000 + Math.random() * 900000)
      .toString();

    user.resetOtp = otp;

    user.resetOtpExpire =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail({

      email,

      subject: "Password Reset OTP",

      message: `
      <h2>Password Reset OTP</h2>

      <h1>${otp}</h1>

      <p>This OTP is valid for 10 minutes.</p>
      `,

    });

    res.status(200).json({

      success: true,

      message: "OTP sent successfully.",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};



// ==========================================
// Verify OTP
// ==========================================

const verifyOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({

      email,

      resetOtp: otp,

      resetOtpExpire: {
        $gt: Date.now(),
      },

    });

    if (!user) {

      return res.status(400).json({

        success: false,

        message: "Invalid or Expired OTP.",

      });

    }

    res.status(200).json({

      success: true,

      message: "OTP Verified.",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};



// ==========================================
// Reset Password
// ==========================================

const resetPassword = async (req, res) => {

  try {

    const {
      email,
      otp,
      password,
    } = req.body;

    const user = await User.findOne({

      email,

      resetOtp: otp,

      resetOtpExpire: {
        $gt: Date.now(),
      },

    });

    if (!user) {

      return res.status(400).json({

        success: false,

        message: "Invalid OTP.",

      });

    }

    user.password = password;

    user.resetOtp = undefined;

    user.resetOtpExpire = undefined;

    await user.save();

    res.status(200).json({

      success: true,

      message: "Password Reset Successfully.",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};



// ==========================================
// Export
// ==========================================

module.exports = {

  registerUser,

  loginUser,

  getProfile,

  updateProfile,

  changePassword,

  forgotPassword,

  verifyOtp,

  resetPassword,

  logoutUser,

};