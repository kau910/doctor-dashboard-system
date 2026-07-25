import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUserMd,
  FaBriefcaseMedical,
  FaMoneyBillWave,
} from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../../services/api";
import Loading from "../../components/common/Loading";

const PatientDoctors = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [doctors, setDoctors] = useState([]);

  const [search, setSearch] = useState("");

  const loadDoctors = async () => {

    try {

      setLoading(true);

      const { data } = await api.get(
        `/doctors?keyword=${search}`
      );

      setDoctors(data.doctors || []);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load doctors"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadDoctors();

  }, []);

  if (loading) {

    return <Loading />;

  }

  return (

    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Doctors
        </h1>

        <p className="text-gray-500 mt-2">
          Find doctors and book appointments.
        </p>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow-md p-5">

        <div className="flex items-center border rounded-lg px-3">

          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search doctor..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full p-3 outline-none"
          />

        </div>

      </div>

      {/* Doctors Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">        {doctors.length === 0 ? (

          <div className="col-span-full bg-white rounded-xl shadow-md p-10 text-center">

            <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />

            <h2 className="text-2xl font-bold text-gray-600">
              No Doctors Found
            </h2>

            <p className="text-gray-500 mt-2">
              No doctors are available at the moment.
            </p>

          </div>

        ) : (

          doctors.map((doctor) => (

            <div
              key={doctor._id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >

              {/* Doctor Image */}

              <div className="flex justify-center">

                {doctor.userId?.profileImage ? (

                  <img
                    src={doctor.userId.profileImage}
                    alt={doctor.userId.fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                  />

                ) : (

                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">

                    <FaUserMd className="text-5xl text-blue-600" />

                  </div>

                )}

              </div>

              {/* Name */}

              <h2 className="text-xl font-bold text-center mt-4">

                Dr. {doctor.userId?.fullName}

              </h2>

              {/* Specialization */}

              <p className="text-center text-blue-600 font-medium mt-2">

                {doctor.specialization}

              </p>

              {/* Qualification */}

              <div className="flex items-center gap-2 mt-5">

                <FaBriefcaseMedical className="text-green-600" />

                <span>

                  {doctor.qualification}

                </span>

              </div>

              {/* Experience */}

              <div className="mt-3">

                Experience :

                <span className="font-semibold ml-2">

                  {doctor.experience} Years

                </span>

              </div>

              {/* Fee */}

              <div className="flex items-center gap-2 mt-3">

                <FaMoneyBillWave className="text-yellow-500" />

                <span>

                  ₹ {doctor.consultationFee}

                </span>

              </div>

              {/* Status */}

              <div className="mt-4">

                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    doctor.status === "Available"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {doctor.status}
                </span>

              </div>

              {/* Button */}

              <button
                onClick={() =>
                  navigate("/patient/book-appointment")
                }
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
              >
                Book Appointment
              </button>

            </div>

          ))

        )}      </div>

    </div>

  );

};

export default PatientDoctors;