import { type EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";

export const LineChart = () => {
  const option: EChartsOption = {
    title: {
      text: "Basic Line Chart",
    },
    tooltip: {
      trigger: "axis",
    },
    yAxis: {
      type: "value",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
        smooth: true,
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: 400, width: 1200 }} />;
};
