import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";

const DoctorAppointments = () => {
    const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);

  const [search, setSearch] = useState("");

  // ==========================
  // Load Appointments
  // ==========================

  const loadAppointments = async () => {

    try {

      const { data } = await api.get(
        "/appointments/doctor"
      );

      setAppointments(
        data.appointments || []
      );

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

  // ==========================
  // Approve
  // ==========================

  const handleApprove = async (id) => {

    try {

      const { data } = await api.put(
        `/appointments/approve/${id}`
      );

      toast.success(data.message);

      loadAppointments();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to approve appointment."
      );

    }

  };

  // ==========================
  // Reject
  // ==========================

  const handleReject = async (id) => {

    try {

      const { data } = await api.put(
        `/appointments/reject/${id}`
      );

      toast.success(data.message);

      loadAppointments();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to reject appointment."
      );

    }

  };

  // ==========================
  // Complete
  // ==========================

  const handleComplete = async (id) => {

    try {

      const { data } = await api.put(
        `/appointments/complete/${id}`
      );

      toast.success(data.message);

      loadAppointments();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to complete appointment."
      );

    }

  };

  // ==========================
  // Search
  // ==========================

  const filteredAppointments =
    appointments.filter((appointment) => {

      const patient =
        appointment.patientId?.userId?.fullName || "";

      return patient
        .toLowerCase()
        .includes(search.toLowerCase());

    });

  if (loading) {

    return <Loading />;

  }

  return (

    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">

          My Appointments

        </h1>

        <p className="text-gray-500 mt-2">

          Manage patient appointments.

        </p>

      </div>

      {/* Search */}

      <input
        type="text"
        placeholder="Search Patient..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full border rounded-xl p-3"
      />

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-5">

          <h3 className="text-gray-500">

            Total

          </h3>

          <h1 className="text-3xl font-bold text-blue-600">

            {appointments.length}

          </h1>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <h3 className="text-gray-500">

            Pending

          </h3>

          <h1 className="text-3xl font-bold text-yellow-500">

            {
              appointments.filter(
                (a) => a.status === "Pending"
              ).length
            }

          </h1>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <h3 className="text-gray-500">

            Approved

          </h3>

          <h1 className="text-3xl font-bold text-green-600">

            {
              appointments.filter(
                (a) => a.status === "Approved"
              ).length
            }

          </h1>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <h3 className="text-gray-500">

            Completed

          </h3>

          <h1 className="text-3xl font-bold text-cyan-600">

            {
              appointments.filter(
                (a) =>
                  a.status === "Completed"
              ).length
            }

          </h1>

        </div>

      </div>      {/* Appointments Table */}

      {filteredAppointments.length === 0 ? (

        <EmptyState
          title="No Appointments Found"
          description="No patient appointments available."
        />

      ) : (

        <DataTable

          columns={[

            {
              key: "patient",
              label: "Patient",

              render: (appointment) =>
                appointment.patientId?.userId?.fullName,
            },

            {
              key: "date",
              label: "Date",

              render: (appointment) =>
                new Date(
                  appointment.appointmentDate
                ).toLocaleDateString(),
            },

            {
              key: "time",
              label: "Time",

              render: (appointment) =>
                appointment.appointmentTime,
            },

            {
              key: "type",
              label: "Type",

              render: (appointment) =>
                appointment.appointmentType,
            },

            {
              key: "symptoms",
              label: "Symptoms",

              render: (appointment) =>
                appointment.symptoms || "-",
            },

            {
              key: "status",
              label: "Status",

              render: (appointment) => (

                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                    appointment.status === "Pending"
                      ? "bg-yellow-500"
                      : appointment.status === "Approved"
                      ? "bg-green-600"
                      : appointment.status === "Completed"
                      ? "bg-blue-600"
                      : appointment.status === "Rejected"
                      ? "bg-red-600"
                      : "bg-gray-500"
                  }`}
                >
                  {appointment.status}
                </span>

              ),
            },

            {
              key: "action",
              label: "Action",

              render: (appointment) => (

                <div className="flex gap-2 flex-wrap">

                  {appointment.status === "Pending" && (

                    <>
                      <button
                        onClick={() =>
                          handleApprove(appointment._id)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleReject(appointment._id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Reject
                      </button>
                    </>

                  )}

                  {appointment.status === "Approved" && (

                    <button
                      onClick={() =>
                        handleComplete(appointment._id)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Complete
                    </button>

                  )}

                  {appointment.status === "Completed" && (

  <button
    onClick={() =>
      navigate(
        `/doctor/create-prescription?appointmentId=${appointment._id}`
      )
    }
    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
  >
    Create Prescription
  </button>

)}

                  {(appointment.status === "Completed" ||
                    appointment.status === "Rejected") && (

                    <span className="text-gray-500 text-sm">
                      No Action
                    </span>

                  )}

                </div>

              ),
            },

          ]}

          data={filteredAppointments}

          loading={loading}

          emptyMessage="No Appointments Found"

        />

      )}

            {/* Summary Section */}

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">

        <h2 className="text-2xl font-bold">

          Doctor Appointment Management

        </h2>

        <p className="mt-3 opacity-90 leading-7">

          Manage all patient appointments from one place.
          Approve, reject or complete appointments quickly
          and keep patient records updated.

        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">

          <div>

            <h3 className="text-3xl font-bold">

              {appointments.length}

            </h3>

            <p>Total</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {
                appointments.filter(
                  (a) => a.status === "Pending"
                ).length
              }

            </h3>

            <p>Pending</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {
                appointments.filter(
                  (a) => a.status === "Approved"
                ).length
              }

            </h3>

            <p>Approved</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {
                appointments.filter(
                  (a) => a.status === "Completed"
                ).length
              }

            </h3>

            <p>Completed</p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default DoctorAppointments;