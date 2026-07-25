import { useEffect, useState } from "react";
import { FaPlus, FaDownload } from "react-icons/fa";

import api from "../../services/api";
import DataTable from "../../components/common/DataTable";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const Prescriptions = () => {

  const [loading, setLoading] = useState(true);

  const [prescriptions, setPrescriptions] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedPrescription, setSelectedPrescription] =
    useState(null);

  const [deleteDialog, setDeleteDialog] =
    useState(false);

  // ===================================
  // Load Prescriptions
  // ===================================

  const loadPrescriptions = async () => {

    try {

      const { data } =
        await api.get("/prescriptions");

      setPrescriptions(
        data.prescriptions || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadPrescriptions();

  }, []);

  // ===================================
  // Delete Prescription
  // ===================================

  const handleDelete = async () => {

    try {

      await api.delete(
        `/prescriptions/${selectedPrescription._id}`
      );

      setPrescriptions((prev)=>
        prev.filter(
          (item)=>
            item._id !==
            selectedPrescription._id
        )
      );

      setDeleteDialog(false);

    } catch(error){

      console.log(error);

    }

  };

  // ===================================
  // Download PDF
  // ===================================

  const downloadPDF = async (id) => {

  try {

    const response = await api.get(

      `/prescriptions/download/${id}`,

      {
        responseType: "blob",
      }

    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;

    link.download = `Prescription-${id}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {

    console.log(error);

  }

};
  // ===================================
  // Search
  // ===================================

  const filteredPrescriptions =
    prescriptions.filter((item)=>{

      const patient =
        item.patientId?.userId?.fullName || "";

      const doctor =
        item.doctorId?.userId?.fullName || "";

      return (

        patient
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        doctor
          .toLowerCase()
          .includes(search.toLowerCase())

      );

    });

  // ===================================
  // Table Columns
  // ===================================

  const columns=[

    {

      key:"patient",

      label:"Patient",

      render:(item)=>
        item.patientId?.userId?.fullName,

    },

    {

      key:"doctor",

      label:"Doctor",

      render:(item)=>
        item.doctorId?.userId?.fullName,

    },

    {

      key:"date",

      label:"Date",

      render:(item)=>

        new Date(

          item.createdAt

        ).toLocaleDateString(),

    },

    {

      key:"pdf",

      label:"PDF",

      render:(item)=>(

        <button

          onClick={()=>

            downloadPDF(item._id)

          }

          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-2"

        >

          <FaDownload />

          PDF

        </button>

      ),

    },

  ];

  if(loading){

    return <Loading />;

  }

  return(

    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">

            Prescriptions

          </h1>

          <p className="text-gray-500">

            Manage Patient Prescriptions

          </p>

        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2">

          <FaPlus />

          Create Prescription

        </button>

      </div>

      {/* Search */}

      <input

        type="text"

        placeholder="Search Patient / Doctor..."

        value={search}

        onChange={(e)=>

          setSearch(e.target.value)

        }

        className="w-full border rounded-xl p-3 bg-white"

      />
            {/* Prescriptions Table */}

      {filteredPrescriptions.length === 0 ? (

        <EmptyState
          title="No Prescriptions Found"
          description="There are no prescriptions available."
          buttonText="Create Prescription"
        />

      ) : (

        <DataTable
          columns={columns}
          data={filteredPrescriptions}
          loading={loading}
          emptyMessage="No Prescriptions Found"
          onView={(prescription) => {
            console.log("View", prescription);
          }}
          onEdit={(prescription) => {
            console.log("Edit", prescription);
          }}
          onDelete={(prescription) => {
            setSelectedPrescription(prescription);
            setDeleteDialog(true);
          }}
        />

      )}

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            Total Prescriptions
          </h3>

          <h1 className="text-4xl font-bold text-blue-600 mt-3">
            {prescriptions.length}
          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            PDF Generated
          </h3>

          <h1 className="text-4xl font-bold text-green-600 mt-3">

            {
              prescriptions.filter(
                (item) => item.pdfUrl
              ).length
            }

          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            Doctors
          </h3>

          <h1 className="text-4xl font-bold text-purple-600 mt-3">

            {
              new Set(
                prescriptions.map(
                  (item) => item.doctorId?._id
                )
              ).size
            }

          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            Patients
          </h3>

          <h1 className="text-4xl font-bold text-cyan-600 mt-3">

            {
              new Set(
                prescriptions.map(
                  (item) => item.patientId?._id
                )
              ).size
            }

          </h1>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-5">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Create Prescription
          </button>

          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
            onClick={() => {
              if (selectedPrescription) {
                downloadPDF(selectedPrescription._id);
              }
            }}
          >
            Download PDF
          </button>

        </div>

        <p className="text-gray-500 text-sm mt-4">
          Select a prescription from the table to download its PDF.
        </p>

      </div>

      {/* Delete Confirmation */}

      <ConfirmDialog
        open={deleteDialog}
        title="Delete Prescription"
        message="Are you sure you want to delete this prescription?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="bg-red-600 hover:bg-red-700"
        onCancel={() => {
          setDeleteDialog(false);
          setSelectedPrescription(null);
        }}
        onConfirm={handleDelete}
      />

            {/* Prescription Summary */}

      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white">

        <h2 className="text-2xl font-bold">
          Prescription Management
        </h2>

        <p className="mt-3 opacity-90 leading-7">
          Manage patient prescriptions, download PDF reports,
          maintain medical history and improve patient care
          through a centralized prescription management system.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">

          <div>

            <h3 className="text-3xl font-bold">
              {prescriptions.length}
            </h3>

            <p>Total Prescriptions</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {
                prescriptions.filter(
                  (item) => item.pdfUrl
                ).length
              }

            </h3>

            <p>PDF Generated</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {
                new Set(
                  prescriptions.map(
                    (item) => item.doctorId?._id
                  )
                ).size
              }

            </h3>

            <p>Doctors</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {
                new Set(
                  prescriptions.map(
                    (item) => item.patientId?._id
                  )
                ).size
              }

            </h3>

            <p>Patients</p>

          </div>

        </div>

      </div>

      {/* Medical Record Info */}

      <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-4">
          Medical Records
        </h2>

        <p className="text-gray-600 leading-7">

          All prescriptions are securely stored and linked with
          their respective appointments. Doctors can generate,
          update and download prescriptions in PDF format,
          while patients can access their records anytime.

        </p>

      </div>

      {/* Future Modal Integration */}

      {/*

      AddPrescriptionModal.jsx

      EditPrescriptionModal.jsx

      Backend APIs

      POST   /api/prescriptions

      PUT    /api/prescriptions/:id

      */}

    </div>

  );

};

export default Prescriptions;