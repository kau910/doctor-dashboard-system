const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");

// ======================================
// Dashboard Statistics
// ======================================
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalPrescriptions,
      pendingAppointments,
      approvedAppointments,
      completedAppointments,
      cancelledAppointments,
    ] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments(),
      Prescription.countDocuments(),
      Appointment.countDocuments({ status: "Pending" }),
      Appointment.countDocuments({ status: "Approved" }),
      Appointment.countDocuments({ status: "Completed" }),
      Appointment.countDocuments({ status: "Cancelled" }),
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalPrescriptions,
        pendingAppointments,
        approvedAppointments,
        completedAppointments,
        cancelledAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Recent Appointments
// ======================================
const getRecentAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "fullName email",
        },
      })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "fullName email",
        },
      })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Today's Appointments
// ======================================
const getTodayAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: new Date(today),
        $lt: new Date(today + "T23:59:59.999Z"),
      },
    })
      .populate("patientId")
      .populate("doctorId");

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Doctor Dashboard
// ======================================
const getDoctorDashboard = async (req, res) => {
  try {

    const doctor = await Doctor.findOne({
      userId: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayAppointments,
      completedAppointments,
      pendingAppointments,
      prescriptions,
    ] = await Promise.all([

      Appointment.find({
        doctorId: doctor._id,
        appointmentDate: {
          $gte: today,
          $lt: tomorrow,
        },
      }).populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "fullName",
        },
      }),

      Appointment.countDocuments({
        doctorId: doctor._id,
        status: "Completed",
      }),

      Appointment.countDocuments({
        doctorId: doctor._id,
        status: "Pending",
      }),

      Prescription.countDocuments({
        doctorId: doctor._id,
      }),

    ]);

    const patientIds = await Appointment.distinct(
      "patientId",
      {
        doctorId: doctor._id,
      }
    );

    res.status(200).json({
      success: true,

      stats: {
        todayAppointments: todayAppointments.length,
        totalPatients: patientIds.length,
        completedAppointments,
        pendingAppointments,
        prescriptions,
        aiRequests: 0,
      },

      todayAppointments,

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
 
// ======================================
// Patient Dashboard
// ======================================

const getPatientDashboard = async (req, res) => {

  try {

    const patient = await Patient.findOne({
      userId: req.user._id,
    });

    if (!patient) {

      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });

    }

    const [
      totalAppointments,
      pendingAppointments,
      approvedAppointments,
      completedAppointments,
      cancelledAppointments,
      totalPrescriptions,
      recentAppointments,
      recentPrescription,
    ] = await Promise.all([

      Appointment.countDocuments({
        patientId: patient._id,
      }),

      Appointment.countDocuments({
        patientId: patient._id,
        status: "Pending",
      }),

      Appointment.countDocuments({
        patientId: patient._id,
        status: "Approved",
      }),

      Appointment.countDocuments({
        patientId: patient._id,
        status: "Completed",
      }),

      Appointment.countDocuments({
        patientId: patient._id,
        status: "Cancelled",
      }),

      Prescription.countDocuments({
        patientId: patient._id,
      }),

      Appointment.find({
        patientId: patient._id,
      })
        .populate({
          path: "doctorId",
          populate: {
            path: "userId",
            select: "fullName",
          },
        })
        .sort({ appointmentDate: -1 })
        .limit(5),

      Prescription.findOne({
        patientId: patient._id,
      })
        .populate({
          path: "doctorId",
          populate: {
            path: "userId",
            select: "fullName",
          },
        })
        .sort({ createdAt: -1 }),

    ]);

    res.status(200).json({

      success: true,

      stats: {

        totalAppointments,
        pendingAppointments,
        approvedAppointments,
        completedAppointments,
        cancelledAppointments,
        totalPrescriptions,

      },

      recentAppointments,

      recentPrescription,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

 module.exports = {
  getDashboardStats,
  getRecentAppointments,
  getTodayAppointments,
  getDoctorDashboard,
  getPatientDashboard,
};