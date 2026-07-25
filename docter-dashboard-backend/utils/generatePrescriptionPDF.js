const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePrescriptionPDF = async (prescription) => {

    const pdfFolder = path.join(__dirname, "../pdf");

    if (!fs.existsSync(pdfFolder)) {
        fs.mkdirSync(pdfFolder);
    }

    const fileName = `Prescription_${Date.now()}.pdf`;

    const filePath = path.join(pdfFolder, fileName);

    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(22)
        .text("Doctor Dashboard System", {
            align: "center",
        });

    doc.moveDown();

    doc.fontSize(16)
        .text("Prescription");

    doc.moveDown();

    doc.text(`Patient ID : ${prescription.patientId}`);
    doc.text(`Doctor ID : ${prescription.doctorId}`);
    doc.text(`Diagnosis : ${prescription.diagnosis}`);

    doc.moveDown();

    doc.text("Medicines");

    prescription.medicines.forEach((medicine, index) => {

        doc.moveDown();

        doc.text(`${index + 1}. ${medicine.medicineName}`);

        doc.text(`Dosage : ${medicine.dosage}`);

        doc.text(`Frequency : ${medicine.frequency}`);

        doc.text(`Duration : ${medicine.duration}`);

    });

    doc.moveDown();

    doc.text(`Instructions : ${prescription.instructions}`);

    doc.moveDown();

    doc.text(
        "Doctor Dashboard System",
        {
            align: "right",
        }
    );

    doc.end();

    return fileName;
};

module.exports = generatePrescriptionPDF;