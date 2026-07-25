import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

const AddPatientModal = ({
  open,
  onClose,
  onSuccess,
}) => {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "Male",
    age: "",
    bloodGroup: "O+",
    height: "",
    weight: "",
    address: "",
    emergencyContact: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/patients", formData);

      toast.success("Patient Added Successfully");

      if (onSuccess) {
        onSuccess();
      }

      onClose();

      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        gender: "Male",
        age: "",
        bloodGroup: "O+",
        height: "",
        weight: "",
        address: "",
        emergencyContact: "",
        status: "Active",
      });

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed To Add Patient"
      );

    } finally {

      setLoading(false);

    }
  };

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">

        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b">

          <h2 className="text-2xl font-bold">
            Add Patient
          </h2>

          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500"
          >
            <FaTimes />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >          {/* Full Name */}

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          {/* Email */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          {/* Password */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          {/* Phone */}

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          {/* Gender & Age */}

          <div className="grid grid-cols-2 gap-4">

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border rounded-lg p-3"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

          </div>

          {/* Blood Group & Status */}

          <div className="grid grid-cols-2 gap-4">

            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="border rounded-lg p-3"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded-lg p-3"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

          </div>

          {/* Height & Weight */}

          <div className="grid grid-cols-2 gap-4">

            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={formData.height}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={formData.weight}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

          </div>

          {/* Address */}

          <textarea
            rows="3"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 resize-none"
          />

          {/* Emergency Contact */}

          <input
            type="text"
            name="emergencyContact"
            placeholder="Emergency Contact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />          {/* Buttons */}

          <div className="flex justify-end gap-4 pt-5 border-t">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Patient"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );
};

export default AddPatientModal;