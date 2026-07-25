import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import Loading from "../../components/common/Loading";

const PatientProfile = () => {

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {

    try {

      const { data } = await api.get(
        "/patients/my-profile"
      );

      setProfile(data.patient);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load profile"
      );

    } finally {

        setLoading(false);

    }

  };

  useEffect(() => {

    loadProfile();

  }, []);

  if (loading) {

    return <Loading />;

  }

  return (

    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">

          My Profile

        </h1>

        <p className="text-gray-500 mt-2">

          View your personal information.

        </p>

      </div>

      {/* Profile Card */}

      <div className="bg-white rounded-2xl shadow-md p-8">

        <div className="flex flex-col items-center">

          {profile?.userId?.profileImage ? (

            <img
              src={profile.userId.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
            />

          ) : (

            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-5xl font-bold text-blue-600">

              {profile?.userId?.fullName?.charAt(0)}

            </div>

          )}

          <h2 className="text-2xl font-bold mt-5">

            {profile?.userId?.fullName}

          </h2>

          <p className="text-gray-500">

            {profile?.userId?.email}

          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">          {/* Full Name */}

          <div>

            <label className="font-semibold text-gray-600">
              Full Name
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {profile?.userId?.fullName}
            </div>

          </div>

          {/* Email */}

          <div>

            <label className="font-semibold text-gray-600">
              Email
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {profile?.userId?.email}
            </div>

          </div>

          {/* Phone */}

          <div>

            <label className="font-semibold text-gray-600">
              Phone
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {profile?.userId?.phone}
            </div>

          </div>

          {/* Gender */}

          <div>

            <label className="font-semibold text-gray-600">
              Gender
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {profile?.gender}
            </div>

          </div>

          {/* Age */}

          <div>

            <label className="font-semibold text-gray-600">
              Age
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {profile?.age}
            </div>

          </div>

          {/* Blood Group */}

          <div>

            <label className="font-semibold text-gray-600">
              Blood Group
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {profile?.bloodGroup}
            </div>

          </div>

          {/* Height */}

          <div>

            <label className="font-semibold text-gray-600">
              Height
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {profile?.height} cm
            </div>

          </div>

          {/* Weight */}

          <div>

            <label className="font-semibold text-gray-600">
              Weight
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {profile?.weight} kg
            </div>

          </div>

          {/* Address */}

          <div className="md:col-span-2">

            <label className="font-semibold text-gray-600">
              Address
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {profile?.address}
            </div>

          </div>

          {/* Emergency Contact */}

          <div className="md:col-span-2">

            <label className="font-semibold text-gray-600">
              Emergency Contact
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {profile?.emergencyContact}
            </div>

          </div>        </div>

      </div>

    </div>

  );

};

export default PatientProfile;