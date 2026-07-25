import { FaBell, FaMoon, FaSun, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);

    document.documentElement.classList.toggle("dark");
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="w-full h-20 bg-white shadow-sm border-b border-gray-200 px-8 flex items-center justify-between">

      {/* Left */}

      <div>

        <h2 className="text-2xl font-bold text-gray-800">
          Doctor Dashboard System
        </h2>

        <p className="text-sm text-gray-500">
          {today}
        </p>

      </div>

      {/* Center */}

      <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-[350px]">

        <FaSearch className="text-gray-400 mr-3" />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent w-full outline-none"
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <button
          onClick={toggleTheme}
          className="w-11 h-11 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <button className="relative w-11 h-11 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition">

          <FaBell />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>

        </button>

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">

            {user?.fullName?.charAt(0).toUpperCase()}

          </div>

          <div className="hidden md:block">

            <h4 className="font-semibold text-gray-800">
              {user?.fullName}
            </h4>

            <p className="text-sm text-gray-500 capitalize">
              {user?.role}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;