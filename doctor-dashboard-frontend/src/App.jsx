import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

// ================= Admin =================
import AdminDashboard from "./pages/admin/AdminDashboard";
import Doctors from "./pages/admin/Doctors";
import Patients from "./pages/admin/Patients";
import Appointments from "./pages/admin/Appointments";
import Prescriptions from "./pages/admin/Prescriptions";
import Reports from "./pages/admin/Reports";

// ================= Doctor =================
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPrescriptions from "./pages/doctor/DoctorPrescriptions";
import CreatePrescription from "./pages/doctor/CreatePrescription";
import DoctorAI from "./pages/doctor/DoctorAI";


// ================= Patient =================
import PatientDashboard from "./pages/patient/PatientDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import PatientDoctors from "./pages/patient/PatientDoctors";
import MyPrescriptions from "./pages/patient/MyPrescriptions";
import PatientProfile from "./pages/patient/PatientProfile";
import AIHealthAssistant from "./pages/patient/AIHealthAssistant";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />
      <Route
  path="/register"
  element={<Register />}
/>


      {/* ================= ADMIN ================= */}

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<Layout />}>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/doctors"
            element={<Doctors />}
          />

          <Route
            path="/admin/patients"
            element={<Patients />}
          />

          <Route
            path="/admin/appointments"
            element={<Appointments />}
          />

          <Route
            path="/admin/prescriptions"
            element={<Prescriptions />}
          />

          <Route
            path="/admin/reports"
            element={<Reports />}
          />
        </Route>
      </Route>

      {/* ================= DOCTOR ================= */}

     <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
  <Route element={<Layout />}>

    <Route
      path="/doctor/dashboard"
      element={<DoctorDashboard />}
    />

    <Route
      path="/doctor/appointments"
      element={<DoctorAppointments />}
    />

    <Route
      path="/doctor/prescriptions"
      element={<DoctorPrescriptions />}
    />

    <Route
  path="/doctor/create-prescription"
  element={<CreatePrescription />}
/>

<Route
  path="/doctor/ai"
  element={<DoctorAI />}
/>

  </Route>
</Route>

      {/* ================= PATIENT ================= */}

      <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
        <Route element={<Layout />}>
          <Route
            path="/patient/dashboard"
            element={<PatientDashboard />}
          />

          <Route
      path="/patient/book-appointment"
      element={<BookAppointment />}
    />

     <Route
      path="/patient/appointments"
      element={<MyAppointments />}
    />

    <Route
      path="/patient/doctors"
      element={<PatientDoctors />}
    />

    <Route
      path="/patient/prescriptions"
      element={<MyPrescriptions />}
    />

    <Route
      path="/patient/profile"
      element={<PatientProfile />}
    />

    <Route
  path="/patient/ai"
  element={<AIHealthAssistant />}
/>
        </Route>
      </Route>



      {/* Redirect */}

      <Route
        path="/home"
        element={<Navigate to="/" replace />}
      />

      {/* 404 */}

      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <h1 className="text-7xl font-bold text-blue-700">
                404
              </h1>

              <p className="mt-4 text-gray-500 text-lg">
                Page Not Found
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;