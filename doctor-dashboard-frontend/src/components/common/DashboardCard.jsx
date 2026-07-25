import CountUp from "react-countup";

const DashboardCard = ({
  title,
  value,
  icon,
  color = "bg-blue-600",
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-slate-800">
  {value ?? 0}
</h2>

        </div>

        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center text-white text-3xl ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default DashboardCard;