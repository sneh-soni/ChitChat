import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { HEADER_COLOR, BUTTON_COLOR } from "../../constants/ColorConstants";
import { getLast7Days } from "../../utils/features";
import {
  Chart as Chartjs,
  CategoryScale,
  Tooltip,
  LinearScale,
  LineElement,
  ArcElement,
  Legend,
  Filler,
  PointElement,
} from "chart.js";

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
        backgroundColor: "rgba(255, 193, 7, 0.2)",
        borderColor: HEADER_COLOR,
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
  //   cutout: 120,
};

const DoughnutChart = ({ labels = [], value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        borderColor: ["rgba(255, 193, 7, 0.2)", "rgba(255, 61, 0, 0.2)"],
        backgroundColor: [HEADER_COLOR, BUTTON_COLOR],
        offset: 20,
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

export { LineChart, DoughnutChart };
