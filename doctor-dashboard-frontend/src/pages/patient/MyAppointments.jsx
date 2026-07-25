import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import Loading from "../../components/common/Loading";

const MyAppointments = () => {

  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);

  const loadAppointments = async () => {

    try {

      const { data } = await api.get(
        "/appointments/my-appointments"
      );

      setAppointments(data.appointments || []);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load appointments"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadAppointments();

  }, []);

  if (loading) {
    return <Loading />;
  }

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          My Appointments
        </h1>

        <p className="text-gray-500 mt-2">
          View all your booked appointments.
        </p>

      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-4">
                Doctor
              </th>

              <th className="text-left p-4">
                Date
              </th>

              <th className="text-left p-4">
                Time
              </th>

              <th className="text-left p-4">
                Type
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-center p-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>{appointments.length === 0 ? (

  <tr>

    <td
      colSpan="6"
      className="text-center py-10 text-gray-500"
    >
      No Appointments Found
    </td>

  </tr>

) : (

  appointments.map((appointment) => (

    <tr
      key={appointment._id}
      className="border-b hover:bg-slate-50"
    >

      <td className="p-4 font-medium">

        Dr. {appointment.doctorId?.userId?.fullName}

      </td>

      <td className="p-4">

        {new Date(
          appointment.appointmentDate
        ).toLocaleDateString()}

      </td>

      <td className="p-4">

        {appointment.appointmentTime}

      </td>

      <td className="p-4">

        {appointment.appointmentType}

      </td>

      <td className="p-4">

        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${
            appointment.status === "Approved"
              ? "bg-green-600"
              : appointment.status === "Completed"
              ? "bg-blue-600"
              : appointment.status === "Rejected"
              ? "bg-red-600"
              : appointment.status === "Cancelled"
              ? "bg-gray-600"
              : "bg-yellow-500"
          }`}
        >
          {appointment.status}
        </span>

      </td>

      <td className="p-4 text-center">

        {appointment.status === "Pending" ? (

          <button
            onClick={async () => {

              if (
                !window.confirm(
                  "Cancel this appointment?"
                )
              )
                return;

              try {

                await api.put(
                  `/appointments/cancel/${appointment._id}`
                );

                toast.success(
                  "Appointment Cancelled"
                );

                loadAppointments();

              } catch (error) {

                toast.error(
                  error.response?.data?.message ||
                    "Cancel Failed"
                );

              }

            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

        ) : (

          <span className="text-gray-500">
            --
          </span>

        )}

      </td>

    </tr>

  ))

)}          </tbody>

        </table>

      </div>

    </div>

  );

};

export default MyAppointments;