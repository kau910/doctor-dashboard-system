import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const AddDoctorModal = ({
  open,
  onClose,
  onSuccess,
}) => {

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      fullName: "",

      email: "",

      password: "",

      phone: "",

      gender: "Male",

      specialization: "",

      qualification: "",

      experience: "",

      consultationFee: "",

      department: "",

      about: "",

    });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await api.post(
        "/doctors",
        formData
      );

      toast.success(
        "Doctor Added Successfully"
      );

      onSuccess();

      onClose();

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Unable to add doctor."

      );

    } finally {

      setLoading(false);

    }

  };

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8">

        <h2 className="text-2xl font-bold mb-6">

          Add Doctor

        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-5"
        >

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />          <select
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
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            name="experience"
            placeholder="Experience (Years)"
            value={formData.experience}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            name="consultationFee"
            placeholder="Consultation Fee"
            value={formData.consultationFee}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <textarea
            name="about"
            placeholder="About Doctor"
            value={formData.about}
            onChange={handleChange}
            className="border rounded-lg p-3 col-span-2 resize-none"
            rows={4}
          />

          <div className="col-span-2 flex justify-end gap-4 mt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Doctor"}
            </button>

          </div>

        </form>
      </div>
    </div>   


  );

};

export default AddDoctorModal;