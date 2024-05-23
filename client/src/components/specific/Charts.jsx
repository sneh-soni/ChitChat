import {
  ArcElement,
  CategoryScale,
  Chart as Chartjs,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { getLast7Days } from "../../utils/features";

Chartjs.register(
  CategoryScale,
  Tooltip,
  LinearScale,
  LineElement,
  ArcElement,
  Legend,
  Filler,
  PointElement
);

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const last7Days = getLast7Days();

const LineChart = ({ value = [] }) => {
  const data = {
    labels: last7Days,
    datasets: [
      {
        label: "Messages",
        data: value,
        fill: true,
        backgroundColor: "rgba(46, 125, 50, 0.5)",
        borderColor: "#1b5e20",
        borderWidth: 1,
      },
    ],
  };
  return <Line data={data} options={lineChartOptions} />;
};

const doughnutChatOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 60,
};

const DoughnutChart = ({ labels = [], value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        borderColor: ["#ef5350", "#c62828"],
        backgroundColor: ["#ef5350", "#c62828"],
        offset: 40,
      },
    ],
  };
  return (
    <Doughnut
      style={{ zIndex: 10 }}
      data={data}
      options={doughnutChatOptions}
    />
  );
};

export { DoughnutChart, LineChart };
