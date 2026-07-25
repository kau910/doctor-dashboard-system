const PDFDocument = require("pdfkit");
const Prescription = require("../models/Prescription");

// ======================================
// Download Prescription PDF
// ======================================

const downloadPrescription = async (req, res) => {

  try {

    const prescription =
      await Prescription.findById(req.params.id)
        .populate("patientId")
        .populate("doctorId")
        .populate("appointmentId");

    if (!prescription) {

      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });

    }

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Prescription-${prescription._id}.pdf`
    );

    const doc = new PDFDocument({
      margin: 50,
    });

    doc.pipe(res);

        // ======================================
    // Hospital Header
    // ======================================

    doc
      .fontSize(22)
      .fillColor("#0d6efd")
      .text("Doctor Dashboard Hospital", {
        align: "center",
      });

    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        "AI Powered Hospital Management System",
        {
          align: "center",
        }
      );

    doc.moveDown();

    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown();

    // ======================================
    // Doctor Details
    // ======================================

    doc
      .fontSize(16)
      .fillColor("#0d6efd")
      .text("Doctor Information");

    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        `Doctor Name : ${prescription.doctorId?.name}`
      );

    doc.text(
      `Specialization : ${prescription.doctorId?.specialization}`
    );

    doc.moveDown();

    // ======================================
    // Patient Details
    // ======================================

    doc
      .fontSize(16)
      .fillColor("#198754")
      .text("Patient Information");

    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        `Patient Name : ${prescription.patientId?.name}`
      );

    doc.text(
      `Appointment Date : ${prescription.appointmentId?.appointmentDate}`
    );

    doc.text(
      `Appointment Time : ${prescription.appointmentId?.appointmentTime}`
    );

    doc.moveDown();

    // ======================================
    // Medicines
    // ======================================

    doc
      .fontSize(16)
      .fillColor("#dc3545")
      .text("Medicines");

    doc.moveDown(0.5);

    prescription.medicines.forEach(
      (medicine, index) => {

        doc
          .fontSize(12)
          .fillColor("black")
          .text(
            `${index + 1}. ${medicine.medicineName}`
          );

        doc.text(
          `Dosage : ${medicine.dosage}`
        );

        doc.text(
          `Frequency : ${medicine.frequency}`
        );

        doc.text(
          `Duration : ${medicine.duration}`
        );

        doc.moveDown();

      }
    );

    // ======================================
    // Notes
    // ======================================

    doc
      .fontSize(16)
      .fillColor("#fd7e14")
      .text("Doctor Notes");

    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        prescription.notes || "No Notes"
      );

    doc.moveDown(2);

    // ======================================
    // Footer
    // ======================================

    doc.text(
      `Generated On : ${new Date().toLocaleDateString()}`
    );

    doc.moveDown();

    doc.text(
      "Doctor Signature",
      {
        align: "right",
      }
    );

    doc.end();

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  downloadPrescription,
};