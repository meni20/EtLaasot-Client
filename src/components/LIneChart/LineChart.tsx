import { type EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useDataContext } from "../../contexts/DataContext.context";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const LineChart = () => {
  const { events } = useDataContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["events"] });
  }, []);

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
    yAxis: {
      type: "value",
      scale: true,
    },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: {
        rotate: 45,
      },
    },
    series: [
      {
        data: values,
        type: "line",
        smooth: true,
        color: "red",
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: 500, width: 1200 }} />;
};
