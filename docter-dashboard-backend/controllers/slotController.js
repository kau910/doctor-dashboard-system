const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// ======================================
// Get Available Slots
// ======================================
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.query;

    if (!doctorId || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "Doctor Id and Appointment Date are required.",
      });
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor Not Found",
      });
    }

    // 30 Minute Slots
    const allSlots = [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "02:00",
      "02:30",
      "03:00",
      "03:30",
      "04:00",
      "04:30",
      "05:00"
    ];

    const bookedSlots = await Appointment.find({
      doctorId,
      appointmentDate,
      status: {
        $ne: "Cancelled",
      },
    }).select("appointmentTime");

    const booked = bookedSlots.map(
      (slot) => slot.appointmentTime
    );

    const availableSlots = allSlots.filter(
      (slot) => !booked.includes(slot)
    );

    res.status(200).json({
      success: true,
      doctorId,
      appointmentDate,
      availableSlots,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getAvailableSlots,
};