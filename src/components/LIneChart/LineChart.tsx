import { type EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useDataContext } from "../../contexts/useDataContext";
import { useMemo } from "react";

export const LineChart = () => {
  const { events } = useDataContext();

  const labels = useMemo(() => {
    return events
      .sort(
        (a, b) =>
          new Date(a?.startDate).getTime() - new Date(b?.startDate).getTime(),
      )
      .map((event) => event.name);
  }, [events]);

  const values = useMemo(() => {
    return events
      .sort(
        (a, b) =>
          new Date(a?.startDate).getTime() - new Date(b?.startDate).getTime(),
      )
      .map((event) => event.attendees?.length || 0);
  }, [events]);

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: 40,
      right: 20,
      top: 20,
      bottom: 60,
      containLabel: true,
    },
    yAxis: {
      type: "value",
      scale: true,
    },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: {
        rotate: 45,
        fontFamily: "Rubik, sans-serif",
        fontSize: 12,
      },
    },
    series: [
      {
        data: values,
        type: "line",
        smooth: true,
        color: "#9a5188",
        areaStyle: { opacity: 0.1, color: "#9a5188" },
        lineStyle: { width: 3 },
        symbolSize: 8,
        itemStyle: { color: "#9a5188" },
      },
    ],
  };
  return (
    <ReactECharts option={option} style={{ height: 400, width: "100%" }} />
  );
};
