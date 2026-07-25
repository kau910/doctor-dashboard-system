import { FaTimes, FaUserCircle } from "react-icons/fa";

const ViewPatientModal = ({
  open,
  onClose,
  patient,
}) => {
  if (!open || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl">

        {/* Header */}

        <div className="flex justify-between items-center border-b p-5">

          <div className="flex items-center gap-3">

            <FaUserCircle className="text-4xl text-blue-600" />

            <div>

              <h2 className="text-2xl font-bold">
                Patient Details
              </h2>

              <p className="text-gray-500">
                Complete Patient Information
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-500"
          >
            <FaTimes />
          </button>

        </div>

        {/* Body */}

        <div className="grid grid-cols-2 gap-6 p-6">

          <Info
            title="Full Name"
            value={patient.userId?.fullName}
          />

          <Info
            title="Email"
            value={patient.userId?.email}
          />

          <Info
            title="Phone"
            value={patient.userId?.phone}
          />

          <Info
            title="Gender"
            value={patient.gender}
          />

          <Info
            title="Age"
            value={patient.age}
          />

          <Info
            title="Blood Group"
            value={patient.bloodGroup}
          />

          <Info
            title="Height"
            value={patient.height + " cm"}
          />

          <Info
            title="Weight"
            value={patient.weight + " kg"}
          />

          <Info
            title="Address"
            value={patient.address}
          />

          <Info
            title="Emergency Contact"
            value={patient.emergencyContact}
          />

          <Info
            title="Status"
            value={patient.status}
          />

          <Info
            title="Date Of Birth"
            value={
              patient.dateOfBirth
                ? new Date(
                    patient.dateOfBirth
                  ).toLocaleDateString()
                : "-"
            }
          />

        </div>

        {/* Allergies */}

        <div className="px-6">

          <h3 className="font-semibold mb-2">
            Allergies
          </h3>

          <div className="border rounded-lg p-3 min-h-[60px]">

            {patient.allergies?.length
              ? patient.allergies.join(", ")
              : "No Allergies"}

          </div>

        </div>

        {/* Medical History */}

        <div className="p-6">

          <h3 className="font-semibold mb-2">
            Medical History
          </h3>

          <div className="border rounded-lg p-3 min-h-[60px]">

            {patient.medicalHistory?.length
              ? patient.medicalHistory.join(", ")
              : "No Medical History"}

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t p-5">

          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

const Info = ({ title, value }) => (
  <div>

    <p className="text-gray-500 text-sm">
      {title}
    </p>

    <h3 className="font-semibold mt-1">
      {value || "-"}
    </h3>

  </div>
);

export default ViewPatientModal;