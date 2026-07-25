import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

const EditPatientModal = ({
  open,
  onClose,
  patient,
  onSuccess,
}) => {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    bloodGroup: "",
    height: "",
    weight: "",
    address: "",
    emergencyContact: "",
    allergies: "",
    medicalHistory: "",
    status: "",
  });

  useEffect(() => {

    if (patient) {

      setFormData({
        age: patient.age || "",
        gender: patient.gender || "Male",
        bloodGroup: patient.bloodGroup || "O+",
        height: patient.height || "",
        weight: patient.weight || "",
        address: patient.address || "",
        emergencyContact:
          patient.emergencyContact || "",
        allergies:
          patient.allergies?.join(", ") || "",
        medicalHistory:
          patient.medicalHistory?.join(", ") || "",
        status: patient.status || "Active",
      });

    }

  }, [patient]);

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  if (!open || !patient) return null;
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/patients/${patient._id}`, {
        ...formData,
        allergies: formData.allergies
          ? formData.allergies.split(",").map((item) => item.trim())
          : [],
        medicalHistory: formData.medicalHistory
          ? formData.medicalHistory.split(",").map((item) => item.trim())
          : [],
      });

      toast.success("Patient Updated Successfully");

      if (onSuccess) {
        onSuccess();
      }

      onClose();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl">

        {/* Header */}

        <div className="flex justify-between items-center border-b p-5">

          <h2 className="text-2xl font-bold">
            Edit Patient
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-500"
          >
            <FaTimes />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label>Age</label>

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label>Gender</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label>Blood Group</label>

              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              >
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>

            </div>

            <div>

              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <input
              type="number"
              name="height"
              placeholder="Height"
              value={formData.height}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              name="weight"
              placeholder="Weight"
              value={formData.weight}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

          </div>

          <textarea
            rows="3"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="emergencyContact"
            placeholder="Emergency Contact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="allergies"
            placeholder="Dust, Medicine..."
            value={formData.allergies}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <textarea
            rows="3"
            name="medicalHistory"
            placeholder="Medical History"
            value={formData.medicalHistory}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <div className="flex justify-end gap-4 pt-4 border-t">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
            >
              {loading ? "Updating..." : "Update Patient"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );

};

export default EditPatientModal;