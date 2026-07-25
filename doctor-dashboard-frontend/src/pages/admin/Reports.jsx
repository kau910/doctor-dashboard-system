import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import Loading from "../../components/common/Loading";

const Reports = () => {

  const [loading, setLoading] = useState(true);

  const [report, setReport] = useState({

    totalDoctors: 0,

    totalPatients: 0,

    totalAppointments: 0,

    totalPrescriptions: 0,

    pendingAppointments: 0,

    approvedAppointments: 0,

    completedAppointments: 0,

    cancelledAppointments: 0,

  });

  // ==========================
  // Load Report
  // ==========================

  const loadReport = async () => {

    try {

      const { data } = await api.get(
        "/reports/dashboard"
      );

      setReport(data.report);

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Unable to load report."

      );

    } finally {

      setLoading(false);

    }

  };
  const handleExportPDF = async () => {

  try {

    const response = await api.get(

      "/reports/export/pdf",

      {
        responseType: "blob",
      }

    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;

    link.download = "Hospital_Report.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success("Report downloaded successfully.");

  } catch (error) {

    toast.error(
      "Unable to download report."
    );

  }

};

const handleExportExcel = async () => {

  try {

    const response = await api.get(

      "/reports/export/excel",

      {

        responseType: "blob",

      }

    );

    const url = window.URL.createObjectURL(

      new Blob([response.data])

    );

    const link = document.createElement("a");

    link.href = url;

    link.download = "Hospital_Report.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success("Excel downloaded successfully.");

  } catch (error) {

    toast.error("Unable to download Excel report.");

  }

};

  useEffect(() => {

    loadReport();

  }, []);

  if (loading) {

    return <Loading />;

  }

  return (

    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">

          Reports & Analytics

        </h1>

        <p className="text-gray-500 mt-2">

          Hospital overview and statistics.

        </p>

      </div>      {/* Statistics Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Doctors */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-gray-500 text-sm">

            Total Doctors

          </h3>

          <h1 className="text-4xl font-bold text-blue-600 mt-3">

            {report.totalDoctors}

          </h1>

        </div>

        {/* Patients */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-gray-500 text-sm">

            Total Patients

          </h3>

          <h1 className="text-4xl font-bold text-green-600 mt-3">

            {report.totalPatients}

          </h1>

        </div>

        {/* Appointments */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-gray-500 text-sm">

            Total Appointments

          </h3>

          <h1 className="text-4xl font-bold text-purple-600 mt-3">

            {report.totalAppointments}

          </h1>

        </div>

        {/* Prescriptions */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-gray-500 text-sm">

            Total Prescriptions

          </h3>

          <h1 className="text-4xl font-bold text-red-600 mt-3">

            {report.totalPrescriptions}

          </h1>

        </div>

      </div>

      {/* Appointment Status */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-yellow-100 rounded-2xl p-6">

          <h3 className="text-yellow-700 font-semibold">

            Pending

          </h3>

          <h1 className="text-4xl font-bold mt-3">

            {report.pendingAppointments}

          </h1>

        </div>

        <div className="bg-blue-100 rounded-2xl p-6">

          <h3 className="text-blue-700 font-semibold">

            Approved

          </h3>

          <h1 className="text-4xl font-bold mt-3">

            {report.approvedAppointments}

          </h1>

        </div>

        <div className="bg-green-100 rounded-2xl p-6">

          <h3 className="text-green-700 font-semibold">

            Completed

          </h3>

          <h1 className="text-4xl font-bold mt-3">

            {report.completedAppointments}

          </h1>

        </div>

        <div className="bg-red-100 rounded-2xl p-6">

          <h3 className="text-red-700 font-semibold">

            Cancelled

          </h3>

          <h1 className="text-4xl font-bold mt-3">

            {report.cancelledAppointments}

          </h1>

        </div>

      </div>      {/* Report Summary */}

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 text-white">

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

          <div>

            <h2 className="text-3xl font-bold">

              Hospital Analytics Report

            </h2>

            <p className="mt-3 text-blue-100 leading-7">

              This report provides a complete overview of the hospital
              management system including doctors, patients,
              appointments and prescriptions.

            </p>

          </div>

          <div className="flex gap-4">

            <button
  onClick={handleExportPDF}
  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold shadow"
>
  Export PDF
</button>
            <button
  onClick={handleExportExcel}
  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow"
>
  Export Excel
</button>

          </div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">

          <div>

            <h3 className="text-4xl font-bold">

              {report.totalDoctors}

            </h3>

            <p className="text-blue-100">

              Doctors

            </p>

          </div>

          <div>

            <h3 className="text-4xl font-bold">

              {report.totalPatients}

            </h3>

            <p className="text-blue-100">

              Patients

            </p>

          </div>

          <div>

            <h3 className="text-4xl font-bold">

              {report.totalAppointments}

            </h3>

            <p className="text-blue-100">

              Appointments

            </p>

          </div>

          <div>

            <h3 className="text-4xl font-bold">

              {report.totalPrescriptions}

            </h3>

            <p className="text-blue-100">

              Prescriptions

            </p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Reports;