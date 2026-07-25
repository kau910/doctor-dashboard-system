const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

const ApiFeatures = require("../utils/apiFeatures");
const sendEmail = require("../utils/sendEmail");

// ==========================================
// Book Appointment
// ==========================================

const bookAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      appointmentType,
      symptoms,
      notes,
    } = req.body;

    console.log("Logged In User:", req.user);

    // Check Patient
    const patient = await Patient.findOne({
  userId: req.user._id,
});

console.log("Patient Found:", patient);

if (!patient) {
  return res.status(404).json({
    success: false,
    message: "Patient profile not found",
  });
}


    // Check Doctor
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Double Booking Check
    const alreadyBooked = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: {
        $ne: "Cancelled",
      },
    });

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked.",
      });
    }

   // Create Appointment
const appointment = await Appointment.create({
  patientId: patient._id,
  doctorId,
  appointmentDate,
  appointmentTime,
  appointmentType,
  symptoms,
  notes,
});
    // Patient Email
    const patientUser = await User.findById(patient.userId);

    if (patientUser) {
      await sendEmail({
        email: patientUser.email,
        subject: "Appointment Booked Successfully",
        message: `
          <h2>Appointment Confirmed</h2>

          <p>Your appointment request has been submitted successfully.</p>

          <b>Date:</b> ${appointmentDate}<br>

          <b>Time:</b> ${appointmentTime}<br>

          <b>Status:</b> Pending
        `,
      });
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ==========================================
// Get All Appointments
// ==========================================

const getAllAppointments = async (req, res) => {

  try {

    const apiFeatures = new ApiFeatures(

      Appointment.find()

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
        }),

      req.query

    )

      .filter()
      .sort()
      .paginate(10);

    const appointments = await apiFeatures.query;

    const totalAppointments =
      await Appointment.countDocuments();

    res.status(200).json({

      success: true,

      totalAppointments,

      currentPage:
        Number(req.query.page) || 1,

      resultPerPage: 10,

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

// ==========================================
// Get Appointment By ID
// ==========================================

const getAppointmentById = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "fullName email phone profileImage",
        },
      })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "fullName email phone profileImage",
        },
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================
// Patient's Appointments
// ==========================================

const getMyAppointments = async (req, res) => {
  try {

    const patient = await Patient.findOne({
      userId: req.user._id,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const appointments = await Appointment.find({
      patientId: patient._id,
    })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "fullName email profileImage",
        },
      })
      .sort({
        appointmentDate: -1,
      });

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



// ==========================================
// Doctor Appointments
// ==========================================

const getDoctorAppointments = async (req, res) => {
  try {

    const doctor = await Doctor.findOne({
      userId: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const apiFeatures = new ApiFeatures(

      Appointment.find({
        doctorId: doctor._id,
      })
        .populate({
          path: "patientId",
          populate: {
            path: "userId",
            select: "fullName email phone profileImage",
          },
        }),

      req.query

    )
      .filter()
      .sort()
      .paginate(10);

    const appointments = await apiFeatures.query;

    res.status(200).json({
      success: true,
      currentPage: Number(req.query.page) || 1,
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

// ==========================================
// Approve Appointment
// ==========================================

const approveAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "Approved";
    await appointment.save();

    const patient = await Patient.findById(appointment.patientId);
    const patientUser = await User.findById(patient.userId);

    if (patientUser) {
      await sendEmail({
        email: patientUser.email,
        subject: "Appointment Approved",
        message: `
          <h2>Your Appointment has been Approved</h2>

          <p>Please visit the hospital on your scheduled time.</p>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment approved successfully.",
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================
// Reject Appointment
// ==========================================

const rejectAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "Rejected";
    await appointment.save();

    const patient = await Patient.findById(appointment.patientId);
    const patientUser = await User.findById(patient.userId);

    if (patientUser) {
      await sendEmail({
        email: patientUser.email,
        subject: "Appointment Rejected",
        message: `
          <h2>Appointment Rejected</h2>

          <p>Please book another available slot.</p>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment rejected successfully.",
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================
// Complete Appointment
// ==========================================

const completeAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "Completed";

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment completed successfully.",
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================
// Cancel Appointment
// ==========================================

const cancelAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "Cancelled";

    await appointment.save();

    const patient = await Patient.findById(appointment.patientId);
    const patientUser = await User.findById(patient.userId);

    if (patientUser) {
      await sendEmail({
        email: patientUser.email,
        subject: "Appointment Cancelled",
        message: `
          <h2>Appointment Cancelled</h2>

          <p>Your appointment has been cancelled.</p>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================
// Delete Appointment
// ==========================================

const deleteAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully.",
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
  bookAppointment,
  getAllAppointments,
  getAppointmentById,
  getMyAppointments,
  getDoctorAppointments,
  approveAppointment,
  rejectAppointment,
  completeAppointment,
  cancelAppointment,
  deleteAppointment,
};