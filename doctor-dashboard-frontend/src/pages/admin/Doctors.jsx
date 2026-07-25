import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import api from "../../services/api";
import DataTable from "../../components/common/DataTable";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AddDoctorModal from "./AddDoctorModal";
const Doctors = () => {

  const [loading, setLoading] = useState(true);

  const [doctors, setDoctors] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [deleteDialog, setDeleteDialog] =
    useState(false);

    const [openAddModal, setOpenAddModal] =
  useState(false);

  // ===============================
  // Load Doctors
  // ===============================

  const loadDoctors = async () => {

    try {

      const { data } = await api.get("/doctors");

      setDoctors(data.doctors || []);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadDoctors();

  }, []);

  // ===============================
  // Delete Doctor
  // ===============================

  const handleDelete = async () => {

    try {

      await api.delete(
        `/doctors/${selectedDoctor._id}`
      );

      setDoctors((prev) =>
        prev.filter(
          (doctor) =>
            doctor._id !== selectedDoctor._id
        )
      );

      setDeleteDialog(false);

    } catch (error) {

      console.log(error);

    }

  };

  // ===============================
  // Search
  // ===============================

  const filteredDoctors = doctors.filter((doctor) => {

    const name =
      doctor.userId?.fullName || "";

    const specialization =
      doctor.specialization || "";

    return (
      name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      specialization
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  });

  // ===============================
  // Table Columns
  // ===============================

  const columns = [

    {
      key: "name",

      label: "Doctor",

      render: (doctor) =>
        doctor.userId?.fullName,
    },

    {
      key: "specialization",

      label: "Specialization",
    },

    {
      key: "experience",

      label: "Experience",

      render: (doctor) =>
        `${doctor.experience} Years`,
    },

    {
      key: "consultationFee",

      label: "Fee",

      render: (doctor) =>
        `₹${doctor.consultationFee}`,
    },

    {
      key: "status",

      label: "Status",

      render: (doctor) => (

        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${
            doctor.status === "Available"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >

          {doctor.status}

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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">

            Doctors

          </h1>

          <p className="text-gray-500">

            Manage Doctors

          </p>

        </div>

        <button
  onClick={() => setOpenAddModal(true)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
>
  <FaPlus />
  Add Doctor
</button>

      </div>

      {/* Search */}

      <input
        type="text"
        placeholder="Search Doctor..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full bg-white rounded-xl border p-3"
      />      {/* Doctors Table */}

      {filteredDoctors.length === 0 ? (

        <EmptyState
          title="No Doctors Found"
          description="There are no doctors available."
          buttonText="Add Doctor"
        />

      ) : (

        <DataTable
          columns={columns}
          data={filteredDoctors}
          loading={loading}
          emptyMessage="No Doctors Found"
          onView={(doctor) => {
            console.log("View", doctor);
          }}
          onEdit={(doctor) => {
            console.log("Edit", doctor);
          }}
          onDelete={(doctor) => {
            setSelectedDoctor(doctor);
            setDeleteDialog(true);
          }}
        />

      )}

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            Total Doctors
          </h3>

          <h1 className="text-4xl font-bold text-blue-600 mt-3">
            {doctors.length}
          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            Available
          </h3>

          <h1 className="text-4xl font-bold text-green-600 mt-3">

            {
              doctors.filter(
                (doctor) =>
                  doctor.status === "Available"
              ).length
            }

          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            Unavailable
          </h3>

          <h1 className="text-4xl font-bold text-red-600 mt-3">

            {
              doctors.filter(
                (doctor) =>
                  doctor.status === "Unavailable"
              ).length
            }

          </h1>

        </div>

      </div>

      {/* Delete Confirmation */}

      <AddDoctorModal
  open={openAddModal}
  onClose={() => setOpenAddModal(false)}
  onSuccess={loadDoctors}
/>

      <ConfirmDialog
        open={deleteDialog}
        title="Delete Doctor"
        message="Are you sure you want to delete this doctor?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="bg-red-600 hover:bg-red-700"
        onCancel={() => {
          setDeleteDialog(false);
          setSelectedDoctor(null);
        }}
        onConfirm={handleDelete}
      />      {/* Add Doctor Modal (UI Ready) */}

      {/* Future Integration:
          AddDoctorModal Component
          Backend POST /api/doctors
      */}

      {/* Edit Doctor Modal (UI Ready) */}

      {/* Future Integration:
          EditDoctorModal Component
          Backend PUT /api/doctors/:id
      */}

      {/* Doctor Summary */}

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">

        <h2 className="text-2xl font-bold">

          Doctor Management

        </h2>

        <p className="mt-3 opacity-90 leading-7">

          Manage doctors, update their profiles,
          monitor availability and keep hospital
          records organized from one place.

        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">

          <div>

            <h3 className="text-3xl font-bold">

              {doctors.length}

            </h3>

            <p>Total Doctors</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {
                doctors.filter(
                  (doctor) =>
                    doctor.status === "Available"
                ).length
              }

            </h3>

            <p>Available</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {
                doctors.filter(
                  (doctor) =>
                    doctor.status === "Unavailable"
                ).length
              }

            </h3>

            <p>Unavailable</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {
                new Set(
                  doctors.map(
                    (doctor) =>
                      doctor.specialization
                  )
                ).size
              }

            </h3>

            <p>Departments</p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Doctors;