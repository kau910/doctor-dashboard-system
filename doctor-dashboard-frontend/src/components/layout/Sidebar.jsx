import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaFilePrescription,
  FaRobot,
  FaChartBar,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { logout, user } = useAuth();

  const adminMenu = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/admin/dashboard",
    },
    {
      name: "Doctors",
      icon: <FaUserMd />,
      path: "/admin/doctors",
    },
    {
      name: "Patients",
      icon: <FaUsers />,
      path: "/admin/patients",
    },
    {
      name: "Appointments",
      icon: <FaCalendarCheck />,
      path: "/admin/appointments",
    },
    {
      name: "Prescriptions",
      icon: <FaFilePrescription />,
      path: "/admin/prescriptions",
    },
    {
      name: "Reports",
      icon: <FaChartBar />,
      path: "/admin/reports",
    },
  ];

  const doctorMenu = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/doctor/dashboard",
    },
    {
      name: "Appointments",
      icon: <FaCalendarCheck />,
      path: "/doctor/appointments",
    },
    {
      name: "Prescriptions",
      icon: <FaFilePrescription />,
      path: "/doctor/prescriptions",
    },
    {
      name: "AI Assistant",
      icon: <FaRobot />,
      path: "/doctor/ai",
    },
  ];

  const patientMenu = [
  {
    name: "Dashboard",
    icon: <FaHome />,
    path: "/patient/dashboard",
  },

  {
    name: "Book Appointment",
    icon: <FaCalendarCheck />,
    path: "/patient/book-appointment",
  },

  {
    name: "My Appointments",
    icon: <FaCalendarCheck />,
    path: "/patient/appointments",
  },

  {
    name: "View Doctors",
    icon: <FaUserMd />,
    path: "/patient/doctors",
  },

  {
    name: "My Prescriptions",
    icon: <FaFilePrescription />,
    path: "/patient/prescriptions",
  },

  {
    name: "My Profile",
    icon: <FaUsers />,
    path: "/patient/profile",
  },

  {
    name: "AI Health Assistant",
    icon: <FaRobot />,
    path: "/patient/ai",
  },
];

  const menu =
    user?.role === "admin"
      ? adminMenu
      : user?.role === "doctor"
      ? doctorMenu
      : patientMenu;

  return (
    <aside className="w-72 min-h-screen bg-blue-700 text-white flex flex-col">

      <div className="p-6 border-b border-blue-600">
        <h1 className="text-2xl font-bold">
          Doctor Dashboard
        </h1>

        <p className="text-sm mt-2 opacity-80">
          Welcome {user?.fullName}
        </p>
      </div>

      <nav className="flex-1 p-4">

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg mb-3 transition-all ${
                isActive
                  ? "bg-white text-blue-700 font-semibold"
                  : "hover:bg-blue-600"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>

            <span>{item.name}</span>
          </NavLink>
        ))}

      </nav>

      <div className="p-4 border-t border-blue-600">

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 rounded-lg py-3 transition-all"
        >
          <FaSignOutAlt />

          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;