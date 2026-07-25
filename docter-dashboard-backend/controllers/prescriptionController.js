const fs = require("fs");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const User = require("../models/User");
const Doctor = require("../models/Doctor"); // 👈 Yahan

const ApiFeatures = require("../utils/apiFeatures");
const generatePrescriptionPDF = require("../utils/generatePrescriptionPDF");
const sendEmail = require("../utils/sendEmail");

// ======================================
// Create Prescription
// ======================================

const createPrescription = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.body.appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const exists = await Prescription.findOne({
      appointmentId: req.body.appointmentId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Prescription already exists.",
      });
    }

   // Doctor Profile

// Logged-in doctor
const doctor = await Doctor.findOne({
  userId: req.user._id,
});

if (!doctor) {
  return res.status(404).json({
    success: false,
    message: "Doctor profile not found.",
  });
}


// Security Check
if (
  appointment.doctorId.toString() !==
  doctor._id.toString()
) {
  return res.status(403).json({
    success: false,
    message: "Unauthorized appointment.",
  });
}



// Create Prescription
const prescription =
  await Prescription.create({

    appointmentId: appointment._id,

    patientId: appointment.patientId,

    doctorId: doctor._id,

    diagnosis: req.body.diagnosis,

    medicines: req.body.medicines,

    instructions: req.body.instructions,

    followUpDate: req.body.followUpDate,

  });

    // Generate PDF
    const pdfFile = await generatePrescriptionPDF(prescription);

    prescription.pdfUrl = pdfFile;

    await prescription.save();

    // Patient Email
  const patient = await Patient.findById(
  appointment.patientId
);

    if (patient) {

      const patientUser = await User.findById(patient.userId);

      if (patientUser) {

        await sendEmail({

          email: patientUser.email,

          subject: "Prescription Ready",

          message: `
            <h2>Your Prescription is Ready</h2>

            <p>Please login and download your prescription.</p>
          `,

        });

      }

    }

    res.status(201).json({

      success: true,

      message: "Prescription created successfully.",

      prescription,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};



// ======================================
// Get All Prescriptions
// ======================================

const getAllPrescriptions = async (req, res) => {

  try {

    const apiFeatures = new ApiFeatures(

      Prescription.find()

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

        .populate("appointmentId"),

      req.query

    )

      .filter()
      .sort()
      .paginate(10);

    const prescriptions =
      await apiFeatures.query;

    const totalPrescriptions =
      await Prescription.countDocuments();

    res.status(200).json({

      success: true,

      totalPrescriptions,

      currentPage:
        Number(req.query.page) || 1,

      resultPerPage: 10,

      count: prescriptions.length,

      prescriptions,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};



// ======================================
// Get Prescription By ID
// ======================================

const getPrescriptionById = async (req, res) => {

  try {

    const prescription =
      await Prescription.findById(req.params.id)

        .populate({
          path: "patientId",
          populate: {
            path: "userId",
            select: "fullName email phone",
          },
        })

        .populate({
          path: "doctorId",
          populate: {
            path: "userId",
            select: "fullName email phone",
          },
        })

        .populate("appointmentId");

    if (!prescription) {

      return res.status(404).json({

        success: false,

        message: "Prescription not found.",

      });

    }

    res.status(200).json({

      success: true,

      prescription,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

const path = require("path");

// ======================================
// Update Prescription
// ======================================
const updatePrescription = async (req, res) => {
  try {

    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Prescription updated successfully.",
      prescription,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Delete Prescription
// ======================================
const deletePrescription = async (req, res) => {
  try {

    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    await prescription.deleteOne();

    res.status(200).json({
      success: true,
      message: "Prescription deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Download Prescription PDF
// ======================================
const downloadPrescription = async (req, res) => {
  try {

    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    if (!prescription.pdfUrl) {
      return res.status(404).json({
        success: false,
        message: "PDF not found.",
      });
    }

    const filePath = path.resolve(
      __dirname,
      "..",
      "pdf",
      prescription.pdfUrl
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "PDF file does not exist.",
      });
    }

    return res.download(filePath);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Get My Prescriptions (Patient)
// ======================================

const getMyPrescriptions = async (req, res) => {

  try {

    const patient = await Patient.findOne({
      userId: req.user._id,
    });

    if (!patient) {

      return res.status(404).json({
        success: false,
        message: "Patient profile not found.",
      });

    }

    const prescriptions = await Prescription.find({
      patientId: patient._id,
    })

      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "fullName email profileImage",
        },
      })

      .populate("appointmentId")

      .sort({
        createdAt: -1,
      });

    res.status(200).json({

      success: true,

      count: prescriptions.length,

      prescriptions,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ======================================
// Export
// ======================================
 module.exports = {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  downloadPrescription,
  getMyPrescriptions,
};