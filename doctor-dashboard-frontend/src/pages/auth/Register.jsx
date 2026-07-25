import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const Register = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: "patient",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "Male",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {

      setLoading(true);

      const payload = {
        role: formData.role,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
      };

      const { data } = await api.post(
        "/auth/register",
        payload
      );

      toast.success(data.message);

     navigate("/");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Registration failed."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8">

        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Register as Doctor or Patient
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-8"
        >

          {/* Role */}

          <div>

            <label className="font-semibold">
              Select Role
            </label>

            <div className="grid grid-cols-2 gap-4 mt-3">

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: "doctor",
                  })
                }
                className={`rounded-xl p-4 border font-semibold ${
                  formData.role === "doctor"
                    ? "bg-blue-600 text-white"
                    : "bg-white"
                }`}
              >
                👨‍⚕️ Doctor
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: "patient",
                  })
                }
                className={`rounded-xl p-4 border font-semibold ${
                  formData.role === "patient"
                    ? "bg-green-600 text-white"
                    : "bg-white"
                }`}
              >
                👤 Patient
              </button>

            </div>

          </div>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          >
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p className="text-center mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-600 font-semibold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  );

};

export default Register;