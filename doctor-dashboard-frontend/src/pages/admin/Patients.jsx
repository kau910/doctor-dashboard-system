import ViewPatientModal from "../../components/patient/ViewPatientModal";
import EditPatientModal from "../../components/patient/EditPatientModal";
import AddPatientModal from "../../components/patient/AddPatientModal";
import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaSync,
} from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../../services/api";
import Loading from "../../components/common/Loading";

const Patients = () => {
  const [loading, setLoading] = useState(true);

  const [patients, setPatients] = useState([]);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPatients, setTotalPatients] = useState(0);

  const [showAddModal, setShowAddModal] = useState(false);

const [showEditModal, setShowEditModal] = useState(false);

const [showViewModal, setShowViewModal] = useState(false);

const [selectedPatient, setSelectedPatient] = useState(null);


  const loadPatients = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/patients?page=${currentPage}&keyword=${search}`
      );

      setPatients(data.patients);

      setTotalPatients(data.totalPatients);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load patients"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [currentPage]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Patients
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all patients
          </p>

        </div>

        <button
  onClick={() => setShowAddModal(true)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
></button>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow-md p-5 flex gap-4">

        <div className="flex-1 flex items-center border rounded-lg px-3">

          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search patient..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full p-3 outline-none"
          />

        </div>

        <button
          onClick={loadPatients}
          className="bg-green-600 text-white px-5 rounded-lg flex items-center gap-2"
        >
          <FaSync />

          Refresh

        </button>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Phone
              </th>

              <th className="text-left p-4">
                Blood Group
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-center p-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {patients.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-10 text-gray-500"
                >
                  No Patients Found
                </td>

              </tr>

            ) : (

              patients.map((patient) => (              

                <tr
                  key={patient._id}
                  className="border-b hover:bg-slate-50 transition"
                >

                  <td className="p-4 font-semibold">

                    {patient.userId?.fullName}

                  </td>

                  <td className="p-4">

                    {patient.userId?.email}

                  </td>

                  <td className="p-4">

                    {patient.userId?.phone}

                  </td>

                  <td className="p-4">

                    {patient.bloodGroup}

                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        patient.status === "Active"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {patient.status}
                    </span>

                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-3">

                      {/* View */}

                      <button
  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
  onClick={() => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  }}
>
  <FaEye />
</button>

                      {/* Edit */}

                      <button
  className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"
  onClick={() => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  }}
></button>

                      {/* Delete */}

                      <button
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                        onClick={async () => {

                          const confirmDelete =
                            window.confirm(
                              "Delete this patient?"
                            );

                          if (!confirmDelete) return;

                          try {

                            await api.delete(
                              `/patients/${patient._id}`
                            );

                            toast.success(
                              "Patient Deleted Successfully"
                            );

                            loadPatients();

                          } catch (error) {

                            toast.error(
                              error.response?.data?.message ||
                                "Delete Failed"
                            );

                          }

                        }}
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center">

        <p className="text-gray-600">

          Total Patients :

          <span className="font-bold ml-2">

            {totalPatients}

          </span>

        </p>

        <div className="flex gap-3">

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
            className="bg-gray-200 px-5 py-2 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Next
          </button>

        </div>

      </div>

            {/* Add Patient Button Placeholder */}

      <div className="fixed bottom-8 right-8">

        <button
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl text-2xl flex items-center justify-center"
          title="Add Patient"
          onClick={() => {
            // AddPatientModal yahan open hoga
            toast.info("Add Patient Modal Coming Next");
          }}
        >
          <FaPlus />
        </button>

      </div>

      {/* Footer */}

      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-3">

          Patient Management

        </h2>

        <p className="text-gray-600 leading-7">

          This page is connected directly with the backend.
          Admin can manage patient records including
          viewing, editing and deleting patient information.
          Search and pagination are supported for easy
          navigation.

        </p>

      </div>

       <EditPatientModal
  open={showEditModal}
  onClose={() => setShowEditModal(false)}
  patient={selectedPatient}
  onSuccess={loadPatients}
/>
      <AddPatientModal
  open={showAddModal}
  onClose={() => setShowAddModal(false)}
  onSuccess={loadPatients}
/>


    </div>
  );
  <ViewPatientModal
  open={showViewModal}
  onClose={() => setShowViewModal(false)}
  patient={selectedPatient}
/>
};

export default Patients;