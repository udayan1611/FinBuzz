// import React from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const StocksChart = ({ data, symbol }) => {
//   if (!data || data.s !== "ok") {
//     return (
//       <div style={{ background: "#222", padding: "20px", color: "white" }}>
//         No valid data available.
//       </div>
//     );
//   }

//   const chartData = {
//     labels: data.t.map((timestamp) => {
//       const date = new Date(timestamp * 1000);
//       return date.toLocaleDateString();
//     }),
//     datasets: [
//       {
//         label: `${symbol} Closing Price`,
//         data: data.c,
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         fill: true,
//         tension: 0.1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: { title: { display: true, text: `${symbol} 30-day Historical Chart` } },
//     scales: {
//       x: { title: { display: true, text: "Date" } },
//       y: { title: { display: true, text: "Price (USD)" } },
//     },
//   };

//   return <Line data={chartData} options={options} />;
// };

// export default StocksChart;

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StocksChart = ({ data, symbol, lineColor }) => {
  if (!data || data.s !== "ok") {
    return (
      <div style={{ background: "#222", padding: "20px", color: "white" }}>
        No valid data available.
      </div>
    );
  }

  const chartData = {
    labels: data.t.map((timestamp) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: `${symbol} Closing Price`,
        data: data.c,
        borderColor: lineColor,
        backgroundColor: `${lineColor}33`,
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${symbol} Historical Chart`,
      },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Price (USD)" } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default StocksChart;
