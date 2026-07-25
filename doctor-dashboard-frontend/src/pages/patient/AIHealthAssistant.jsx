import { useState } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../../services/api";

const AIHealthAssistant = () => {

  const [loading, setLoading] = useState(false);

  const [symptoms, setSymptoms] = useState("");

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

      console.log("AI Response:", data);
console.log("Recommendation:", data.recommendation);

     setResult({
  disease: data.disease,
  recommendation: data.recommendation,
});

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to generate recommendation."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">

          AI Health Assistant

        </h1>

        <p className="text-gray-500 mt-2">

          Describe your symptoms to get an AI-generated health recommendation.

        </p>

      </div>

      {/* Form */}

      <div className="bg-white rounded-2xl shadow-md p-6">

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <textarea
            rows="6"
            placeholder="Example: Fever, headache, body pain..."
            value={symptoms}
            onChange={(e) =>
              setSymptoms(e.target.value)
            }
            className="w-full border rounded-xl p-4 resize-none outline-none"
          />          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-3 disabled:opacity-60"
          >

            <FaPaperPlane />

            {loading
              ? "Generating..."
              : "Get AI Recommendation"}

          </button>

        </form>

      </div>

      {/* Result */}

      {result && (

        <div className="bg-white rounded-2xl shadow-md p-6">

          <div className="flex items-center gap-3 mb-5">

            <FaRobot className="text-3xl text-blue-600" />

            <h2 className="text-2xl font-bold">

              AI Recommendation

            </h2>

          </div>

          <div className="bg-slate-100 rounded-xl p-5 space-y-5">

  <div>

    <h3 className="font-bold text-lg text-blue-700">
      Possible Disease
    </h3>

    <p className="mt-2">
      {result?.disease}
    </p>

  </div>

  <div>

    <h3 className="font-bold text-lg text-green-700">
      Recommendation
    </h3>

    <p className="mt-2 whitespace-pre-wrap leading-7">
      {result?.recommendation}
    </p>

  </div>

</div>

          <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-xl p-4">

            <p className="text-sm text-yellow-700">

              ⚠️ This recommendation is AI-generated and is not a replacement for professional medical advice. Please consult your doctor before taking any medication.

            </p>

          </div>

        </div>

      )}    </div>

  );

};

export default AIHealthAssistant;