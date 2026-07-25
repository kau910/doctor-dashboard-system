const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    specialization: {
      type: String,
      default: "General Physician",
      trim: true,
    },

    qualification: {
      type: String,
      default: "Not Updated",
      trim: true,
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    consultationFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    availableDays: {
      type: [String],
      default: [],
    },

    availableTime: {
      start: {
        type: String,
        default: "09:00",
      },

      end: {
        type: String,
        default: "17:00",
      },
    },

    department: {
      type: String,
      default: "General",
      trim: true,
    },

    about: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);