import { FaFolderOpen } from "react-icons/fa";

const EmptyState = ({
  title = "No Data Found",
  description = "There is no data available at the moment.",
  buttonText = "",
  onClick = null,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center justify-center text-center">

      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">

        <FaFolderOpen className="text-5xl text-blue-600" />

      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-800">
        {title}
      </h2>

      <p className="mt-3 text-gray-500 max-w-md">
        {description}
      </p>

      {buttonText && (
        <button
          onClick={onClick}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
        >
          {buttonText}
        </button>
      )}

    </div>
  );
};

export default EmptyState;