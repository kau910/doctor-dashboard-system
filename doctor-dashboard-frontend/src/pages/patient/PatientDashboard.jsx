import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaFilePrescription,
  FaRobot,
  FaTimesCircle,
} from "react-icons/fa";

import api from "../../services/api";
import Loading from "../../components/common/Loading";
import DashboardCard from "../../components/common/DashboardCard";
import DashboardChart from "../../components/charts/DashboardChart";
import EmptyState from "../../components/common/EmptyState";

const PatientDashboard = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({

    totalAppointments: 0,

    pendingAppointments: 0,

    approvedAppointments: 0,

    completedAppointments: 0,

    cancelledAppointments: 0,

    totalPrescriptions: 0,

  });

  const [appointments, setAppointments] = useState([]);

  const [recentPrescription, setRecentPrescription] =
    useState(null);

  const loadDashboard = async () => {

    try {

      const { data } = await api.get(
        "/dashboard/patient"
      );

      setStats(data.stats || {});

      setAppointments(
        data.recentAppointments || []
      );

      setRecentPrescription(
        data.recentPrescription || null
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

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-slate-800">

          Patient Dashboard

        </h1>

        <p className="text-gray-500 mt-2">

          Welcome Back 👋

        </p>

      </div>

      {/* Dashboard Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <DashboardCard
          title="Appointments"
          value={stats.totalAppointments}
          color="bg-blue-600"
          icon={<FaCalendarCheck />}
        />

        <DashboardCard
          title="Pending"
          value={stats.pendingAppointments}
          color="bg-yellow-500"
          icon={<FaClock />}
        />

        <DashboardCard
          title="Approved"
          value={stats.approvedAppointments}
          color="bg-green-600"
          icon={<FaCheckCircle />}
        />

        <DashboardCard
          title="Completed"
          value={stats.completedAppointments}
          color="bg-cyan-600"
          icon={<FaCheckCircle />}
        />

        <DashboardCard
          title="Prescriptions"
          value={stats.totalPrescriptions}
          color="bg-red-600"
          icon={<FaFilePrescription />}
        />

        <DashboardCard
          title="Cancelled"
          value={stats.cancelledAppointments}
          color="bg-purple-600"
          icon={<FaTimesCircle />}
        />

      </div>

      {/* Chart */}

      <DashboardChart
        title="Appointment Statistics"
        data={[
          stats.pendingAppointments,
          stats.approvedAppointments,
          stats.completedAppointments,
          stats.cancelledAppointments,
        ]}
      />      {/* Bottom Section */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Appointments */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-bold">

              Recent Appointments

            </h2>

            <button
              onClick={() =>
                navigate("/patient/appointments")
              }
              className="text-blue-600 font-semibold"
            >
              View All
            </button>

          </div>

          {appointments.length === 0 ? (

            <EmptyState
              title="No Appointments"
              description="No appointments available."
            />

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b">

                    <th className="text-left py-3">
                      Doctor
                    </th>

                    <th className="text-left py-3">
                      Date
                    </th>

                    <th className="text-left py-3">
                      Time
                    </th>

                    <th className="text-left py-3">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {appointments.map((item) => (

                    <tr
                      key={item._id}
                      className="border-b hover:bg-slate-50 transition"
                    >

                      <td className="py-3 font-medium">

                        Dr. {item.doctorId?.userId?.fullName || "N/A"}

                      </td>

                      <td>

                        {new Date(
                          item.appointmentDate
                        ).toLocaleDateString()}

                      </td>

                      <td>

                        {item.appointmentTime}

                      </td>

                      <td>

                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
                            item.status === "Approved"
                              ? "bg-green-600"
                              : item.status === "Completed"
                              ? "bg-blue-600"
                              : item.status === "Cancelled"
                              ? "bg-red-600"
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

        {/* Quick Actions */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-xl font-bold mb-5">

            Quick Actions

          </h2>

          <div className="space-y-4">

            <button
              onClick={() =>
                navigate("/patient/book-appointment")
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
            >
              Book Appointment
            </button>

            <button
              onClick={() =>
                navigate("/patient/appointments")
              }
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
              My Appointments
            </button>

            <button
              onClick={() =>
                navigate("/patient/doctors")
              }
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg"
            >
              View Doctors
            </button>

            <button
              onClick={() =>
                navigate("/patient/prescriptions")
              }
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
            >
              My Prescriptions
            </button>

            <button
              onClick={() =>
                navigate("/patient/profile")
              }
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg"
            >
              My Profile
            </button>

            <button
              onClick={() =>
                navigate("/patient/ai")
              }
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
            >
              AI Health Assistant
            </button>

          </div>

          {/* AI Card */}

          <div className="mt-8 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 p-5 text-white">

            <h3 className="font-bold text-lg">

              🤖 AI Health Assistant

            </h3>

            <p className="mt-3 text-sm leading-6">

              Describe your symptoms and receive AI-powered health recommendations before consulting your doctor.

            </p>

          </div>

        </div>

      </div>      {/* Bottom Cards */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Prescription */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-bold">
              Latest Prescription
            </h2>

            <button
              onClick={() =>
                navigate("/patient/prescriptions")
              }
              className="text-blue-600 font-semibold"
            >
              View All
            </button>

          </div>

          {!recentPrescription ? (

            <EmptyState
              title="No Prescription"
              description="No prescription available."
            />

          ) : (

            <div className="border rounded-xl p-5">

              <h3 className="text-lg font-bold">

                Dr.{" "}
                {recentPrescription.doctorId?.userId?.fullName}

              </h3>

              <p className="text-gray-500 mt-2">

                {new Date(
                  recentPrescription.createdAt
                ).toLocaleDateString()}

              </p>

              <button
                onClick={() =>
                  navigate("/patient/prescriptions")
                }
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                View Prescription
              </button>

            </div>

          )}

        </div>

        {/* Health Summary */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-xl font-bold mb-5">
            Health Summary
          </h2>

          {/* Completed */}

          <div className="mb-6">

            <div className="flex justify-between mb-2">

              <span>Completed</span>

              <span className="font-semibold">
                {stats.completedAppointments}
              </span>

            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full">

              <div
                className="h-3 bg-green-500 rounded-full"
                style={{
                  width: `${
                    stats.totalAppointments
                      ? (stats.completedAppointments /
                          stats.totalAppointments) *
                        100
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

          {/* Pending */}

          <div className="mb-6">

            <div className="flex justify-between mb-2">

              <span>Pending</span>

              <span className="font-semibold">
                {stats.pendingAppointments}
              </span>

            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full">

              <div
                className="h-3 bg-yellow-500 rounded-full"
                style={{
                  width: `${
                    stats.totalAppointments
                      ? (stats.pendingAppointments /
                          stats.totalAppointments) *
                        100
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

          {/* Prescription */}

          <div>

            <div className="flex justify-between mb-2">

              <span>Prescriptions</span>

              <span className="font-semibold">
                {stats.totalPrescriptions}
              </span>

            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full">

              <div
                className="h-3 bg-blue-600 rounded-full"
                style={{
                  width: `${
                    stats.totalAppointments
                      ? (stats.totalPrescriptions /
                          stats.totalAppointments) *
                        100
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

          {/* Wellness */}

          <div className="mt-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white">

            <h3 className="text-xl font-bold">
              🌿 Daily Wellness Tips
            </h3>

            <ul className="mt-4 space-y-2 text-sm">

              <li>✔ Drink 2–3 litres of water daily.</li>

              <li>✔ Sleep at least 7–8 hours.</li>

              <li>✔ Exercise 30 minutes every day.</li>

              <li>✔ Eat a balanced healthy diet.</li>

              <li>✔ Follow your doctor's advice.</li>

            </ul>

          </div>

        </div>

      </div>

    </div>

  );

};

export default PatientDashboard;