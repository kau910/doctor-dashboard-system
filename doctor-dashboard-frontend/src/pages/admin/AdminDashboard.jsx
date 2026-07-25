import { useEffect, useState } from "react";
import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaFilePrescription,
} from "react-icons/fa";

import api from "../../services/api";
import Loading from "../../components/common/Loading";
import DashboardCard from "../../components/common/DashboardCard";

const AdminDashboard = () => {

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({});

  const [recentAppointments, setRecentAppointments] = useState([]);

  const [todayAppointments, setTodayAppointments] = useState([]);

  const loadDashboard = async () => {

    try {

      const [

        statsRes,

        recentRes,

        todayRes,

      ] = await Promise.all([

        api.get("/dashboard/stats"),

        api.get("/dashboard/recent"),

        api.get("/dashboard/today"),

      ]);

      setStats(statsRes.data.dashboard);

      setRecentAppointments(
        recentRes.data.appointments
      );

      setTodayAppointments(
        todayRes.data.appointments
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadDashboard();

  }, []);

  if (loading) {

    return <Loading />;

  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Admin Dashboard

        </h1>

        <p className="text-gray-500 mt-2">

          Welcome Admin 👋

        </p>

      </div>

      {/* Dashboard Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <DashboardCard
          title="Doctors"
          value={stats.totalDoctors}
          color="bg-blue-600"
          icon={<FaUserMd />}
        />

        <DashboardCard
          title="Patients"
          value={stats.totalPatients}
          color="bg-green-600"
          icon={<FaUsers />}
        />

        <DashboardCard
          title="Appointments"
          value={stats.totalAppointments}
          color="bg-yellow-500"
          icon={<FaCalendarCheck />}
        />

        <DashboardCard
          title="Prescriptions"
          value={stats.totalPrescriptions}
          color="bg-red-600"
          icon={<FaFilePrescription />}
        />

      </div>      {/* Recent Appointments */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow-md p-6">

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-xl font-bold">
              Recent Appointments
            </h2>

            <span className="text-sm text-gray-500">
              Last 10
            </span>

          </div>

          {recentAppointments.length === 0 ? (

            <div className="text-center py-10 text-gray-500">
              No Recent Appointments
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b">

                    <th className="text-left py-3">
                      Patient
                    </th>

                    <th className="text-left py-3">
                      Doctor
                    </th>

                    <th className="text-left py-3">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentAppointments.map((item) => (

                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="py-3">
                        {item.patientId?.userId?.fullName}
                      </td>

                      <td>
                        {item.doctorId?.userId?.fullName}
                      </td>

                      <td>

                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
                            item.status === "Approved"
                              ? "bg-green-600"
                              : item.status === "Completed"
                              ? "bg-blue-600"
                              : item.status === "Rejected"
                              ? "bg-red-600"
                              : item.status === "Cancelled"
                              ? "bg-gray-600"
                              : "bg-yellow-500"
                          }`}
                        >
                          {item.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* Today's Appointments */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-xl font-bold">
              Today's Appointments
            </h2>

            <span className="text-sm text-gray-500">
              {todayAppointments.length} Today
            </span>

          </div>

          {todayAppointments.length === 0 ? (

            <div className="text-center py-10 text-gray-500">
              No Appointments Today
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b">

                    <th className="text-left py-3">
                      Patient
                    </th>

                    <th className="text-left py-3">
                      Doctor
                    </th>

                    <th className="text-left py-3">
                      Time
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {todayAppointments.map((item) => (

                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="py-3">
                        {item.patientId?.userId?.fullName}
                      </td>

                      <td>
                        {item.doctorId?.userId?.fullName}
                      </td>

                      <td>
                        {item.appointmentTime}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* Appointment Status */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <DashboardCard
          title="Pending"
          value={stats.pendingAppointments}
          color="bg-yellow-500"
        />

        <DashboardCard
          title="Approved"
          value={stats.approvedAppointments}
          color="bg-green-600"
        />

        <DashboardCard
          title="Completed"
          value={stats.completedAppointments}
          color="bg-blue-600"
        />

        <DashboardCard
          title="Cancelled"
          value={stats.cancelledAppointments}
          color="bg-red-600"
        />      {/* Hospital Summary */}

        </div>

      <div className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-2xl p-8 text-white">

        <h2 className="text-2xl font-bold">
          Hospital Overview
        </h2>

        <p className="mt-3 leading-7 opacity-90">

          Welcome to the Doctor Dashboard Administration Panel.
          Here you can monitor doctors, patients, appointments,
          prescriptions and daily hospital activities in one place.

        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">

          <div>

            <h3 className="text-3xl font-bold">

              {stats.totalDoctors}

            </h3>

            <p>Doctors</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {stats.totalPatients}

            </h3>

            <p>Patients</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {stats.totalAppointments}

            </h3>

            <p>Appointments</p>

          </div>

          <div>

            <h3 className="text-3xl font-bold">

              {stats.totalPrescriptions}

            </h3>

            <p>Prescriptions</p>

          </div>

        </div>

      </div>

      {/* Quick Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            Pending Appointments
          </h3>

          <h1 className="text-4xl font-bold text-yellow-500 mt-4">

            {stats.pendingAppointments}

          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            Approved Appointments
          </h3>

          <h1 className="text-4xl font-bold text-green-600 mt-4">

            {stats.approvedAppointments}

          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-lg font-semibold">
            Completed Appointments
          </h3>

          <h1 className="text-4xl font-bold text-blue-600 mt-4">

            {stats.completedAppointments}

          </h1>

        </div>

      </div>

      {/* Footer */}

      <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-xl font-bold mb-3">

          Dashboard Information

        </h2>

        <p className="text-gray-600 leading-7">

          This dashboard is connected directly with the backend
          APIs and displays real-time hospital statistics.
          Doctors, Patients, Appointments and Prescriptions are
          updated dynamically from the MongoDB database.

        </p>

      </div>

    </div>

  );

};

export default AdminDashboard;