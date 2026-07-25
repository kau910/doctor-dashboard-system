import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

import api from "../../services/api";
import DataTable from "../../components/common/DataTable";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const Appointments = () => {

  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [deleteDialog, setDeleteDialog] =
    useState(false);

  // ===========================
  // Load Appointments
  // ===========================

  const loadAppointments = async () => {

    try {

      const { data } =
        await api.get("/appointments");

      setAppointments(
        data.appointments || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadAppointments();

  }, []);

  // ===========================
  // Delete Appointment
  // ===========================

  const handleDelete = async () => {

  try {

    const { data } = await api.delete(
      `/appointments/${selectedAppointment._id}`
    );

    toast.success(data.message);

    setAppointments((prev) =>
      prev.filter(
        (item) =>
          item._id !== selectedAppointment._id
      )
    );

    setDeleteDialog(false);
    setSelectedAppointment(null);

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Unable to delete appointment."
    );

  }

};

  // ===========================
  // Approve Appointment
  // ===========================

  const approveAppointment = async (id) => {

    try {

      await api.put(
        `/appointments/approve/${id}`
      );

      loadAppointments();

    } catch (error) {

      console.log(error);

    }

  };

  // ===========================
  // Reject Appointment
  // ===========================

  const rejectAppointment = async (id) => {

    try {

      await api.put(
        `/appointments/reject/${id}`
      );

      loadAppointments();

    } catch (error) {

      console.log(error);

    }

  };

  // ===========================
  // Search + Filter
  // ===========================

  const filteredAppointments =
    appointments.filter((item) => {

      const patient =
        item.patientId?.userId?.fullName || "";

      const doctor =
        item.doctorId?.userId?.fullName || "";

      const searchMatch =
        patient
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        doctor
          .toLowerCase()
          .includes(search.toLowerCase());

      const statusMatch =
        statusFilter === ""
          ? true
          : item.status === statusFilter;

      return searchMatch && statusMatch;

    });

  // ===========================
  // Table Columns
  // ===========================

  const columns = [

    {
      key: "patient",
      label: "Patient",
      render: (item) =>
        item.patientId?.userId?.fullName,
    },

    {
      key: "doctor",
      label: "Doctor",
      render: (item) =>
        item.doctorId?.userId?.fullName,
    },

    {
      key: "date",
      label: "Date",
      render: (item) =>
        new Date(
          item.appointmentDate
        ).toLocaleDateString(),
    },

    {
      key: "time",
      label: "Time",
      render: (item) =>
        item.appointmentTime,
    },

    {
      key: "status",
      label: "Status",
      render: (item) => (

        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${
            item.status === "Approved"
              ? "bg-green-600"
              : item.status === "Completed"
              ? "bg-blue-600"
              : item.status === "Rejected"
              ? "bg-red-600"
              : "bg-yellow-500"
          }`}
        >

          {item.status}

        </span>

      ),
    },

  ];

  if (loading) {

    return <Loading />;

  }

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">

            Appointments

          </h1>

          <p className="text-gray-500">

            Manage Hospital Appointments

          </p>

        </div>

        <button className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700">

          <FaPlus />

          Book Appointment

        </button>

      </div>

      {/* Search + Filter */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Search Patient / Doctor..."
          className="border rounded-xl p-3 bg-white"
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
        />

        <select
          className="border rounded-xl p-3 bg-white"
          value={statusFilter}
          onChange={(e)=>
            setStatusFilter(e.target.value)
          }
        >

          <option value="">
            All Status
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Approved">
            Approved
          </option>

          <option value="Rejected">
            Rejected
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

      </div>      {/* Appointments Table */}

      {filteredAppointments.length === 0 ? (

        <EmptyState
          title="No Appointments Found"
          description="There are no appointments available."
          buttonText="Book Appointment"
        />

      ) : (

        <DataTable
          columns={columns}
          data={filteredAppointments}
          loading={loading}
          emptyMessage="No Appointments Found"
          onView={(appointment) => {
            console.log("View", appointment);
          }}
          onEdit={(appointment) => {
            console.log("Edit", appointment);
          }}
          onDelete={(appointment) => {
            setSelectedAppointment(appointment);
            setDeleteDialog(true);
          }}
        />

      )}

      {/* Quick Actions */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            Total Appointments
          </h3>

          <h1 className="text-4xl font-bold text-blue-600 mt-3">
            {appointments.length}
          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            Approved
          </h3>

          <h1 className="text-4xl font-bold text-green-600 mt-3">

            {
              appointments.filter(
                (item) => item.status === "Approved"
              ).length
            }

          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            Pending
          </h3>

          <h1 className="text-4xl font-bold text-yellow-500 mt-3">

            {
              appointments.filter(
                (item) => item.status === "Pending"
              ).length
            }

          </h1>

        </div>

      </div>

      {/* Appointment Actions */}

      <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-5">
          Appointment Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={() => {
              if (selectedAppointment) {
                approveAppointment(selectedAppointment._id);
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
          >
            Approve Appointment
          </button>

          <button
            onClick={() => {
              if (selectedAppointment) {
                rejectAppointment(selectedAppointment._id);
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
          >
            Reject Appointment
          </button>

        </div>

        <p className="text-gray-500 text-sm mt-4">
          Select an appointment from the table, then use these actions.
        </p>

      </div>

      {/* Delete Confirmation */}

      <ConfirmDialog
        open={deleteDialog}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="bg-red-600 hover:bg-red-700"
        onCancel={() => {
          setDeleteDialog(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleDelete}
      />      {/* Appointment Summary */}

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">

        <h2 className="text-2xl font-bold">
          Appointment Management
        </h2>

        <p className="mt-3 opacity-90 leading-7">
          Manage all hospital appointments, monitor appointment
          status, approve or reject requests, and keep schedules
          organized efficiently.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8">

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
                  (item) => item.status === "Pending"
                ).length
              }
            </h3>
            <p>Pending</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">
              {
                appointments.filter(
                  (item) => item.status === "Approved"
                ).length
              }
            </h3>
            <p>Approved</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">
              {
                appointments.filter(
                  (item) => item.status === "Completed"
                ).length
              }
            </h3>
            <p>Completed</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">
              {
                appointments.filter(
                  (item) => item.status === "Rejected"
                ).length
              }
            </h3>
            <p>Rejected</p>
          </div>

        </div>

      </div>

    </div>

  );

};

export default Appointments;