import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";

const DoctorPrescriptions = () => {

  const [loading, setLoading] = useState(true);

  const [prescriptions, setPrescriptions] = useState([]);

  const [search, setSearch] = useState("");

  // ==========================
  // Load Prescriptions
  // ==========================

  const loadPrescriptions = async () => {

    try {

      const { data } = await api.get(
        "/prescriptions"
      );

       console.log(data.prescriptions); // 👈 Ye line add karo

      setPrescriptions(
        data.prescriptions || []
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load prescriptions."
      );

    } finally {

      setLoading(false);

    }

  };

  

  const handleDownload = async (id) => {
    console.log("handleDownload called", id);
    console.log("Token:", localStorage.getItem("token"));
    console.log("Authorization:",
  `Bearer ${localStorage.getItem("token")}`
);

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

    toast.success("Prescription downloaded.");

  } catch (error) {

    toast.error("Unable to download prescription.");

  }

};

  useEffect(() => {

    loadPrescriptions();

  }, []);

  // ==========================
  // Search
  // ==========================

  const filteredPrescriptions =
    prescriptions.filter((prescription) => {

      const patient =
        prescription.patientId?.userId?.fullName || "";

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

          My Prescriptions

        </h1>

        <p className="text-gray-500 mt-2">

          View and manage patient prescriptions.

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-5">

          <h3 className="text-gray-500">

            Total Prescriptions

          </h3>

          <h1 className="text-3xl font-bold text-blue-600">

            {prescriptions.length}

          </h1>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <h3 className="text-gray-500">

            Downloadable

          </h3>

          <h1 className="text-3xl font-bold text-green-600">

            {
              prescriptions.filter(
                (p) => p.pdfUrl
              ).length
            }

          </h1>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <h3 className="text-gray-500">

            Patients

          </h3>

          <h1 className="text-3xl font-bold text-cyan-600">

            {
              new Set(
                prescriptions.map(
                  (p) => p.patientId?._id
                )
              ).size
            }

          </h1>

        </div>
         </div>

              {/* Prescriptions Table */}

      {filteredPrescriptions.length === 0 ? (

        <EmptyState
          title="No Prescriptions Found"
          description="No prescriptions available."
        />

      ) : (

        <DataTable

          columns={[

            {
              key: "patient",
              label: "Patient",

              render: (prescription) =>
                prescription.patientId?.userId?.fullName,
            },

            {
              key: "doctor",
              label: "Doctor",

              render: (prescription) =>
                `Dr. ${prescription.doctorId?.userId?.fullName}`,
            },

            {
              key: "diagnosis",
              label: "Diagnosis",

              render: (prescription) =>
                prescription.diagnosis || "-",
            },

            {
              key: "medicines",
              label: "Medicines",

              render: (prescription) =>

               prescription.medicines?.length
  ? prescription.medicines
      .map((m) => m.medicineName)
      .join(", ")
  : "-"
            },

            {
              key: "date",
              label: "Created",

              render: (prescription) =>
                new Date(
                  prescription.createdAt
                ).toLocaleDateString(),
            },

            {
              key: "pdf",
              label: "PDF",

              render: (prescription) => (

                prescription.pdfUrl ? (
<button
  onClick={() =>
    handleDownload(prescription._id)
  }
  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
>
  Download
</button>

                ) : (

                  <span className="text-gray-500">
                    Not Available
                  </span>

                )

              ),
            },

          ]}

          data={filteredPrescriptions}

          loading={loading}

          emptyMessage="No Prescriptions Found"

        />

      )}      {/* Summary */}

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">

        <h2 className="text-2xl font-bold">

          Prescription Management

        </h2>

        <p className="mt-3 opacity-90 leading-7">

          View all prescriptions, download PDF reports
          and manage patient treatment records from one place.

        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">

          <div>

            <h3 className="text-3xl font-bold">

              {prescriptions.length}

            </h3>

            <p>Total</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {
                prescriptions.filter(
                  (p) => p.pdfUrl
                ).length
              }

            </h3>

            <p>PDF Ready</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {
                new Set(
                  prescriptions.map(
                    (p) => p.patientId?._id
                  )
                ).size
              }

            </h3>

            <p>Patients</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {
                prescriptions.filter(
                  (p) => p.followUpDate
                ).length
              }

            </h3>

            <p>Follow Ups</p>

          </div>

        </div>

      </div>

    </div> 
  );
};

export default DoctorPrescriptions;