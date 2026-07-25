const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    appointmentType: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Offline",
    },

    symptoms: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    meetingLink: {
      type: String,
      default: "",
    },

    aiRecommendation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent Double Booking
appointmentSchema.index(
  {
    doctorId: 1,
    appointmentDate: 1,
    appointmentTime: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);