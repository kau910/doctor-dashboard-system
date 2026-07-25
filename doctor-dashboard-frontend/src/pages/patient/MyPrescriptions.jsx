import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaDownload,
  FaFilePrescription,
} from "react-icons/fa";

import api from "../../services/api";
import Loading from "../../components/common/Loading";

const MyPrescriptions = () => {

  const [loading, setLoading] = useState(true);

  const [prescriptions, setPrescriptions] = useState([]);

  const loadPrescriptions = async () => {

    try {

      const { data } = await api.get(
        "/prescriptions/my-prescriptions"
      );

      setPrescriptions(
        data.prescriptions || []
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
          "Unable to load prescriptions"
      );

    } finally {

      setLoading(false);

    }

  };

  // ==========================
// Download Prescription PDF
// ==========================

const handleDownload = async (id) => {

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

    toast.success("Prescription downloaded successfully.");

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Unable to download prescription."
    );

  }

};

  useEffect(() => {

    loadPrescriptions();

  }, []);

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

          View and download your prescriptions.

        </p>

      </div>

      {/* Table */}

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

                Diagnosis

              </th>

              <th className="text-left p-4">

                Medicines

              </th>

              <th className="text-center p-4">

                Download

              </th>

            </tr>

          </thead>

          <tbody>          {prescriptions.length === 0 ? (

            <tr>

              <td
                colSpan="5"
                className="text-center py-12"
              >

                <FaFilePrescription className="text-6xl text-gray-300 mx-auto mb-4" />

                <h2 className="text-2xl font-bold text-gray-600">
                  No Prescriptions Found
                </h2>

                <p className="text-gray-500 mt-2">
                  Your prescriptions will appear here after the doctor creates them.
                </p>

              </td>

            </tr>

          ) : (

            prescriptions.map((prescription) => (

              <tr
                key={prescription._id}
                className="border-b hover:bg-slate-50 transition"
              >

                {/* Doctor */}

                <td className="p-4 font-semibold">

                  Dr. {prescription.doctorId?.userId?.fullName}

                </td>

                {/* Date */}

                <td className="p-4">

                  {new Date(
                    prescription.createdAt
                  ).toLocaleDateString()}

                </td>

                {/* Diagnosis */}

                <td className="p-4">

                  {prescription.diagnosis || "-"}

                </td>

                {/* Medicines */}

                <td className="p-4">

  {prescription.medicines?.length ? (

    prescription.medicines
      .map((medicine) => medicine.medicineName)
      .join(", ")

  ) : (

    "-"

  )}

</td>

                {/* Download */}

                <td className="p-4 text-center">

                  {prescription.pdfUrl ? (

                    <button
  onClick={() =>
    handleDownload(prescription._id)
  }
  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
>
  Download
</button>

                  ) : (

                    <span className="text-gray-400">
                      Not Available
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

export default MyPrescriptions;