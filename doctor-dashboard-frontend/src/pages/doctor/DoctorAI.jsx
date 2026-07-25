import { useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";

const DoctorAI = () => {

  const [symptoms, setSymptoms] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!symptoms.trim()) {
      return toast.error("Please enter symptoms.");
    }

    try {

      setLoading(true);

      const { data } = await api.post(
        "/ai/recommend",
        {
          symptoms,
        }
      );

      setResult(data);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "AI recommendation failed."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">

          Doctor AI Assistant

        </h1>

        <p className="text-gray-500 mt-2">

          Get AI recommendations based on patient symptoms.

        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-6 space-y-5"
      >        {/* Symptoms */}

        <div>

          <label className="block font-semibold mb-2">
            Patient Symptoms
          </label>

          <textarea
            rows="6"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full border rounded-xl p-3"
            placeholder="Example:
Fever
Cough
Headache
Body Pain"
            required
          />

        </div>

        {/* Submit */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >

            {loading
              ? "Analyzing..."
              : "Analyze Symptoms"}

          </button>

        </div>

      </form>

      {/* Result */}

      {result && (

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-2xl font-bold mb-6">

            AI Recommendation

          </h2>

          <div className="space-y-5">

            <div>

              <h3 className="font-semibold text-lg">

                Possible Disease

              </h3>

              <p className="mt-2 text-blue-600 font-bold text-xl">

                {result.disease || "Unknown"}

              </p>

            </div>

            <div>

              <h3 className="font-semibold text-lg">

                Recommendation

              </h3>

              <p className="mt-2 leading-7">

                {result.recommendation}

              </p>

            </div>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg">

              <p className="text-sm">

                ⚠️ This recommendation is AI-generated and
                should not replace professional medical advice.

              </p>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default DoctorAI;