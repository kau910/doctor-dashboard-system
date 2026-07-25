import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const BookAppointment = () => {
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "Offline",
    symptoms: "",
    notes: "",
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const { data } = await api.get("/doctors");

      setDoctors(data.doctors || []);
    } catch (error) {
      toast.error("Unable to load doctors");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/appointments/book", formData);

      toast.success("Appointment Booked Successfully");

      setFormData({
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        appointmentType: "Offline",
        symptoms: "",
        notes: "",
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Booking Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      <div className="bg-white rounded-2xl shadow-md p-8">

        <h1 className="text-3xl font-bold">
          Book Appointment
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Fill the details below to book an appointment.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >          {/* Doctor */}

          <div>

            <label className="block font-medium mb-2">
              Select Doctor
            </label>

            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            >
              <option value="">
                -- Select Doctor --
              </option>

              {doctors.map((doctor) => (

                <option
                  key={doctor._id}
                  value={doctor._id}
                >
                  {doctor.userId?.fullName} (
                  {doctor.specialization})
                </option>

              ))}

            </select>

          </div>

          {/* Date & Time */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="block font-medium mb-2">
                Appointment Date
              </label>

              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />

            </div>

            <div>

              <label className="block font-medium mb-2">
                Appointment Time
              </label>

              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />

            </div>

          </div>

          {/* Appointment Type */}

          <div>

            <label className="block font-medium mb-2">
              Appointment Type
            </label>

            <select
              name="appointmentType"
              value={formData.appointmentType}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="Offline">
                Offline
              </option>

              <option value="Online">
                Online
              </option>

            </select>

          </div>

          {/* Symptoms */}

          <div>

            <label className="block font-medium mb-2">
              Symptoms
            </label>

            <textarea
              rows="4"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Enter your symptoms..."
              className="w-full border rounded-lg p-3 resize-none"
            />

          </div>

          {/* Notes */}

          <div>

            <label className="block font-medium mb-2">
              Notes
            </label>

            <textarea
              rows="4"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
              className="w-full border rounded-lg p-3 resize-none"
            />

          </div>          {/* Buttons */}

          <div className="flex justify-end gap-4 pt-6 border-t">

            <button
              type="button"
              onClick={() =>
                window.history.back()
              }
              className="px-6 py-3 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg disabled:opacity-50"
            >
              {loading
                ? "Booking..."
                : "Book Appointment"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );
};

export default BookAppointment;