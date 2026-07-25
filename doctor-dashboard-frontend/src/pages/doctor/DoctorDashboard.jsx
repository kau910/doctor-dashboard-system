import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaUserInjured,
  FaFilePrescription,
  FaRobot,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import api from "../../services/api";
import DashboardCard from "../../components/common/DashboardCard";
import DashboardChart from "../../components/charts/DashboardChart";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    prescriptions: 0,
    aiRequests: 0,
  });

  const [appointments, setAppointments] = useState([]);

  const loadDashboard = async () => {

    try {

      const { data } = await api.get("/dashboard/doctor");

      setStats(data.stats || {});

      setAppointments(data.todayAppointments || []);

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

          Doctor Dashboard

        </h1>

        <p className="text-gray-500 mt-2">

          Welcome Doctor 👨‍⚕️

        </p>

      </div>

      {/* Dashboard Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <DashboardCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          color="bg-blue-600"
          icon={<FaCalendarCheck />}
        />

        <DashboardCard
          title="Patients"
          value={stats.totalPatients}
          color="bg-green-600"
          icon={<FaUserInjured />}
        />

        <DashboardCard
          title="Completed"
          value={stats.completedAppointments}
          color="bg-cyan-600"
          icon={<FaCheckCircle />}
        />

        <DashboardCard
          title="Pending"
          value={stats.pendingAppointments}
          color="bg-yellow-500"
          icon={<FaClock />}
        />

        <DashboardCard
          title="Prescriptions"
          value={stats.prescriptions}
          color="bg-red-600"
          icon={<FaFilePrescription />}
        />

        <DashboardCard
          title="AI Requests"
          value={stats.aiRequests}
          color="bg-purple-600"
          icon={<FaRobot />}
        />

      </div>

            {/* Dashboard Chart */}

      <DashboardChart
        title="Weekly Appointments"
        data={[8, 12, 15, 10, 18, 14, 20]}
      />

      {/* Bottom Section */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Today's Appointments */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-6">

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-xl font-bold">
              Today's Appointments
            </h2>

            <button className="text-blue-600 font-semibold">
              View All
            </button>

          </div>

          {appointments.length === 0 ? (

            <EmptyState
              title="No Appointment Today"
              description="You don't have any appointments today."
            />

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b">

                    <th className="text-left py-3">
                      Patient
                    </th>

                    <th className="text-left py-3">
                      Time
                    </th>

                    <th className="text-left py-3">
                      Type
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
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="py-3">
                        {item.patientId?.userId?.fullName}
                      </td>

                      <td>
                        {item.appointmentTime}
                      </td>

                      <td>
                        {item.appointmentType}
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

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"  onClick={() => navigate("/doctor/patients")}>
              View Patients
            </button>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"  onClick={() => navigate("/doctor/create-prescription")}>
              Write Prescription
            </button>

            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg"  onClick={() => navigate("/doctor/appointments")}>
              Complete Appointment
            </button>

            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"   onClick={() => navigate("/doctor/ai")}>
              Open AI Assistant
            </button>

          </div>

          {/* AI Summary */}

          <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white">

            <h3 className="font-bold text-lg">
              AI Assistant
            </h3>

            <p className="text-sm mt-2 opacity-90 leading-6">
              Generate smart recommendations and
              assist patients based on symptoms.
            </p>

          </div>

        </div>

      </div>

            {/* Bottom Cards */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Prescriptions */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-bold">
              Recent Prescriptions
            </h2>

            <button className="text-blue-600 font-semibold">
              View All
            </button>

          </div>

          {appointments.length === 0 ? (

            <EmptyState
              title="No Prescription"
              description="No prescription has been created yet."
            />

          ) : (

            <div className="space-y-4">

              {appointments.slice(0, 5).map((item) => (

                <div
                  key={item._id}
                  className="flex justify-between items-center border rounded-xl p-4 hover:bg-slate-50 transition"
                >

                  <div>

                    <h3 className="font-semibold">
                      {item.patientId?.userId?.fullName}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.appointmentDate
                        ? new Date(item.appointmentDate).toLocaleDateString()
                        : "-"}
                    </p>

                  </div>

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                    Prescription

                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* Performance Summary */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-xl font-bold mb-5">
            Performance Summary
          </h2>

          <div className="space-y-5">

            <div>

              <div className="flex justify-between mb-2">

                <span>Appointments Completed</span>

                <span className="font-semibold">
                  {stats.completedAppointments}
                </span>

              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full">

                <div
                  className="h-3 bg-green-500 rounded-full"
                  style={{ width: "80%" }}
                ></div>

              </div>

            </div>

            <div>

              <div className="flex justify-between mb-2">

                <span>Pending Appointments</span>

                <span className="font-semibold">
                  {stats.pendingAppointments}
                </span>

              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full">

                <div
                  className="h-3 bg-yellow-500 rounded-full"
                  style={{ width: "45%" }}
                ></div>

              </div>

            </div>

            <div>

              <div className="flex justify-between mb-2">

                <span>Prescriptions Issued</span>

                <span className="font-semibold">
                  {stats.prescriptions}
                </span>

              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full">

                <div
                  className="h-3 bg-blue-600 rounded-full"
                  style={{ width: "70%" }}
                ></div>

              </div>

            </div>

          </div>

          <div className="mt-8 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white">

            <h3 className="text-xl font-bold">
              Excellent Work 🎉
            </h3>

            <p className="mt-2 text-sm leading-6">

              Keep managing appointments and prescriptions efficiently to improve patient care.

            </p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default DoctorDashboard;