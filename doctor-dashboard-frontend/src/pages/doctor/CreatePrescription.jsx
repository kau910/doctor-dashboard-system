import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";
import Loading from "../../components/common/Loading";

const CreatePrescription = () => {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const appointmentId =
    searchParams.get("appointmentId");

  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);

  const [formData, setFormData] = useState({

    appointmentId: "",

    patientId: "",

    diagnosis: "",

    instructions: "",

    followUpDate: "",

    medicines: [
      {
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
      },
    ],

  });

  // ==================================
  // Load Completed Appointments
  // ==================================

  const loadAppointments = async () => {

    try {

      const { data } = await api.get(
        "/appointments/doctor"
      );

      const completedAppointments =
        data.appointments.filter(
          (appointment) =>
            appointment.status === "Completed"
        );

      setAppointments(completedAppointments);

      console.log("Appointment ID from URL:", appointmentId);
console.log("Completed Appointments:", completedAppointments);
console.log("Form Appointment ID:", formData.appointmentId);

      // Auto Select Appointment
      if (appointmentId) {

       const selectedAppointment = completedAppointments.find(
  (item) => String(item._id) === String(appointmentId)
);

        if (selectedAppointment) {

          setFormData((prev) => ({

            ...prev,

            appointmentId:
              selectedAppointment._id,

            patientId:
              selectedAppointment.patientId?._id ||
              "",

          }));

        }

      }

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load appointments."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadAppointments();

  }, []);

  // ==================================
  // Handle Input Change
  // ==================================

  const handleChange = (e) => {

    setFormData((prev) => ({

      ...prev,

      [e.target.name]: e.target.value,

    }));

  };

  // ==================================
  // Appointment Change
  // ==================================

  const handleAppointmentChange = (e) => {

    const id = e.target.value;

    const appointment =
      appointments.find(
        (item) => item._id === id
      );

    setFormData((prev) => ({

      ...prev,

      appointmentId: id,

      patientId:
        appointment?.patientId?._id || "",

    }));

  };

  // ==================================
  // Submit Prescription
  // ==================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (!formData.appointmentId) {

        return toast.error(
          "Please select an appointment."
        );

      }

      const appointment =
        appointments.find(
          (item) =>
            item._id ===
            formData.appointmentId
        );

      const payload = {

        appointmentId:
          formData.appointmentId,

        patientId:
          formData.patientId,

        doctorId:
          appointment?.doctorId?._id,

        diagnosis:
          formData.diagnosis,

        medicines:
          formData.medicines,

        instructions:
          formData.instructions,

        followUpDate:
          formData.followUpDate,

      };

      const { data } =
        await api.post(
          "/prescriptions",
          payload
        );

      toast.success(data.message);

      navigate(
        "/doctor/prescriptions"
      );

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Unable to create prescription."

      );

    }

  };

  if (loading) {

    return <Loading />;

  }

  return (

  <div className="space-y-6">

    {/* Header */}

    <div>

      <h1 className="text-3xl font-bold">
        Create Prescription
      </h1>

      <p className="text-gray-500 mt-2">
        Create prescription for completed appointments.
      </p>

    </div>

    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
    >

      {/* Appointment */}

      <div>

        <label className="block font-semibold mb-2">
          Completed Appointment
        </label>

        <select
          name="appointmentId"
          value={formData.appointmentId}
          onChange={handleAppointmentChange}
          disabled={!!appointmentId}
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
          required
        >

          <option value="">
            Select Appointment
          </option>

          {appointments.map((appointment) => (

            <option
              key={appointment._id}
              value={appointment._id}
            >

              {appointment.patientId?.userId?.fullName}

              {" - "}

              {new Date(
                appointment.appointmentDate
              ).toLocaleDateString()}

            </option>

          ))}

        </select>

      </div>

      {/* Diagnosis */}

      <div>

        <label className="block font-semibold mb-2">
          Diagnosis
        </label>

        <textarea
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          rows={4}
          required
          placeholder="Enter diagnosis..."
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Instructions */}

      <div>

        <label className="block font-semibold mb-2">
          Instructions
        </label>

        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          rows={4}
          placeholder="Patient instructions..."
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Follow Up */}

      <div>

        <label className="block font-semibold mb-2">
          Follow Up Date
        </label>

        <input
          type="date"
          name="followUpDate"
          value={formData.followUpDate}
          onChange={handleChange}
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Medicines */}

      <div>

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-xl font-bold">

            Medicines

          </h2>

          <button
            type="button"
            onClick={() =>
              setFormData({

                ...formData,

                medicines: [

                  ...formData.medicines,

                  {

                    medicineName: "",

                    dosage: "",

                    frequency: "",

                    duration: "",

                  },

                ],

              })
            }
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >

            + Add Medicine

          </button>

        </div>
         </div>

        {formData.medicines.map((medicine, index) => (

          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
          >

            <input
              type="text"
              placeholder="Medicine Name"
              value={medicine.medicineName}
              onChange={(e) => {

                const medicines = [...formData.medicines];

                medicines[index].medicineName =
                  e.target.value;

                setFormData({
                  ...formData,
                  medicines,
                });

              }}
              className="border rounded-xl p-3"
              required
            />

            <input
              type="text"
              placeholder="Dosage"
              value={medicine.dosage}
              onChange={(e) => {

                const medicines = [...formData.medicines];

                medicines[index].dosage =
                  e.target.value;

                setFormData({
                  ...formData,
                  medicines,
                });

              }}
              className="border rounded-xl p-3"
              required
            />

            <input
              type="text"
              placeholder="Frequency"
              value={medicine.frequency}
              onChange={(e) => {

                const medicines = [...formData.medicines];

                medicines[index].frequency =
                  e.target.value;

                setFormData({
                  ...formData,
                  medicines,
                });

              }}
              className="border rounded-xl p-3"
              required
            />

            <input
              type="text"
              placeholder="Duration"
              value={medicine.duration}
              onChange={(e) => {

                const medicines = [...formData.medicines];

                medicines[index].duration =
                  e.target.value;

                setFormData({
                  ...formData,
                  medicines,
                });

              }}
              className="border rounded-xl p-3"
              required
            />

          </div>

        ))}      {/* Footer Buttons */}

      <div className="flex justify-end gap-4 pt-6 border-t">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          Create Prescription
        </button>

      </div>

    </form>

  </div>

);

};

export default CreatePrescription;