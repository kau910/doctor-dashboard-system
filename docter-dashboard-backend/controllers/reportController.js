const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

// ======================================
// Dashboard Report
// ======================================

const getDashboardReport = async (req, res) => {

  try {

    const totalDoctors =
      await Doctor.countDocuments();

    const totalPatients =
      await Patient.countDocuments();

    const totalAppointments =
      await Appointment.countDocuments();

    const totalPrescriptions =
      await Prescription.countDocuments();

    const pendingAppointments =
      await Appointment.countDocuments({
        status: "Pending",
      });

    const approvedAppointments =
      await Appointment.countDocuments({
        status: "Approved",
      });

    const completedAppointments =
      await Appointment.countDocuments({
        status: "Completed",
      });

    const cancelledAppointments =
      await Appointment.countDocuments({
        status: "Cancelled",
      });

    res.status(200).json({

      success: true,

      report: {

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
// Export Report PDF
// ======================================

const exportReportPDF = async (req, res) => {

  try {

    const totalDoctors =
      await Doctor.countDocuments();

    const totalPatients =
      await Patient.countDocuments();

    const totalAppointments =
      await Appointment.countDocuments();

    const totalPrescriptions =
      await Prescription.countDocuments();

    const pendingAppointments =
      await Appointment.countDocuments({
        status: "Pending",
      });

    const approvedAppointments =
      await Appointment.countDocuments({
        status: "Approved",
      });

    const completedAppointments =
      await Appointment.countDocuments({
        status: "Completed",
      });

    const cancelledAppointments =
      await Appointment.countDocuments({
        status: "Cancelled",
      });

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Hospital_Report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(24)
      .text("Doctor Dashboard Report", {
        align: "center",
      });

    doc.moveDown();

    doc.fontSize(16);

    doc.text(`Total Doctors : ${totalDoctors}`);
    doc.text(`Total Patients : ${totalPatients}`);
    doc.text(`Total Appointments : ${totalAppointments}`);
    doc.text(`Total Prescriptions : ${totalPrescriptions}`);

    doc.moveDown();

    doc.text(`Pending Appointments : ${pendingAppointments}`);
    doc.text(`Approved Appointments : ${approvedAppointments}`);
    doc.text(`Completed Appointments : ${completedAppointments}`);
    doc.text(`Cancelled Appointments : ${cancelledAppointments}`);

    doc.moveDown();

    doc.text(
      `Generated : ${new Date().toLocaleString()}`
    );

    doc.end();

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ======================================
// Export Report Excel
// ======================================

const exportReportExcel = async (req, res) => {

  try {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Hospital Report");

    worksheet.columns = [

      { header: "Report", key: "title", width: 35 },

      { header: "Value", key: "value", width: 20 },

    ];

    worksheet.addRow({
      title: "Total Doctors",
      value: await Doctor.countDocuments(),
    });

    worksheet.addRow({
      title: "Total Patients",
      value: await Patient.countDocuments(),
    });

    worksheet.addRow({
      title: "Total Appointments",
      value: await Appointment.countDocuments(),
    });

    worksheet.addRow({
      title: "Total Prescriptions",
      value: await Prescription.countDocuments(),
    });

    worksheet.addRow({
      title: "Pending Appointments",
      value: await Appointment.countDocuments({
        status: "Pending",
      }),
    });

    worksheet.addRow({
      title: "Approved Appointments",
      value: await Appointment.countDocuments({
        status: "Approved",
      }),
    });

    worksheet.addRow({
      title: "Completed Appointments",
      value: await Appointment.countDocuments({
        status: "Completed",
      }),
    });

    worksheet.addRow({
      title: "Cancelled Appointments",
      value: await Appointment.countDocuments({
        status: "Cancelled",
      }),
    });

    res.setHeader(

      "Content-Type",

      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    );

    res.setHeader(

      "Content-Disposition",

      "attachment; filename=Hospital_Report.xlsx"

    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


module.exports = {

  getDashboardReport,

  exportReportPDF,

  exportReportExcel,

};