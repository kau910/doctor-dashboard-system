const Loading = ({
  text = "Loading...",
  fullScreen = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "min-h-screen" : "h-64"
      }`}
    >
      {/* Spinner */}

      <div className="relative">

        <div className="w-16 h-16 rounded-full border-4 border-slate-200"></div>

        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>

      </div>

      {/* Text */}

      <h2 className="mt-6 text-lg font-semibold text-slate-700">

        {text}

      </h2>

      <p className="text-gray-500 text-sm mt-2">

        Please wait...

      </p>

    </div>
  );
};

export default Loading;