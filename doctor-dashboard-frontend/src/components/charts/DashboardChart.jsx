import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardChart = ({
  title = "Appointments Overview",
  data = [],
}) => {

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
    ],

    datasets: [
      {
        label: title,
        data:
          data.length > 0
            ? data
            : [20, 35, 28, 45, 60, 55, 70],

        borderColor: "#2563EB",

        backgroundColor: "rgba(37,99,235,.15)",

        fill: true,

        tension: 0.4,

        pointRadius: 5,

        pointHoverRadius: 7,
      },
    ],
  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {

        display: false,

      },

      title: {

        display: true,

        text: title,

        font: {

          size: 18,

        },

      },

    },

    scales: {

      y: {

        beginAtZero: true,

      },

    },

  };

  return (

    <div className="bg-white rounded-2xl shadow-md p-6 h-[400px]">

      <Line
        data={chartData}
        options={options}
      />

    </div>

  );

};

export default DashboardChart;