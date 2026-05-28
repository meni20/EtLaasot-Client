import { useDataContext } from "../../contexts/useDataContext";
import { useMemo } from "react";
import { Box, Typography } from "@mui/material";

interface LineChartProps {
  height?: number;
  emptyHeight?: number;
}

export const LineChart = ({ height = 400, emptyHeight = 220 }: LineChartProps) => {
  const { events } = useDataContext();

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) =>
        new Date(a?.startDate).getTime() - new Date(b?.startDate).getTime(),
    );
  }, [events]);

  const labels = useMemo(() => {
    return sortedEvents.map((event) => event.name);
  }, [sortedEvents]);

  const values = useMemo(() => {
    return sortedEvents.map((event) => event.attendees?.length || 0);
  }, [sortedEvents]);
  const maxValue = Math.max(...values, 1);
  const chartWidth = 720;
  const chartHeight = Math.max(height, 180);
  const padding = { top: 16, right: 24, bottom: 64, left: 44 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const points = values.map((value, index) => {
    const x =
      padding.left +
      (values.length === 1 ? innerWidth / 2 : (index / (values.length - 1)) * innerWidth);
    const y = padding.top + innerHeight - (value / maxValue) * innerHeight;
    return { x, y, value, label: labels[index] };
  });
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  if (sortedEvents.length === 0) {
    return (
      <Box
        sx={{
          height: emptyHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: "#999", fontFamily: "Rubik, sans-serif" }}>
          אין אירועים להצגה בגרף.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, width: "100%", overflow: "hidden" }}>
      <svg
        role="img"
        aria-label="משתתפים לפי אירוע"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <line
          x1={padding.left}
          x2={padding.left}
          y1={padding.top}
          y2={padding.top + innerHeight}
          stroke="#E5E0E7"
        />
        <line
          x1={padding.left}
          x2={padding.left + innerWidth}
          y1={padding.top + innerHeight}
          y2={padding.top + innerHeight}
          stroke="#E5E0E7"
        />
        {[0, 0.5, 1].map((ratio) => {
          const y = padding.top + innerHeight - ratio * innerHeight;
          return (
            <g key={ratio}>
              <line
                x1={padding.left}
                x2={padding.left + innerWidth}
                y1={y}
                y2={y}
                stroke="#F2EEF4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6B7280"
              >
                {Math.round(maxValue * ratio)}
              </text>
            </g>
          );
        })}
        <path
          d={`${path} L ${points[points.length - 1].x} ${
            padding.top + innerHeight
          } L ${points[0].x} ${padding.top + innerHeight} Z`}
          fill="rgba(154, 81, 136, 0.10)"
        />
        <path d={path} fill="none" stroke="#9a5188" strokeWidth="3" />
        {points.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle cx={point.x} cy={point.y} r="5" fill="#9a5188" />
            <title>{`${point.label}: ${point.value}`}</title>
            <text
              x={point.x}
              y={chartHeight - 18}
              textAnchor="end"
              transform={`rotate(-35 ${point.x} ${chartHeight - 18})`}
              fontSize="11"
              fontFamily="Rubik, sans-serif"
              fill="#4B5563"
            >
              {point.label.length > 18
                ? `${point.label.slice(0, 18)}...`
                : point.label}
            </text>
          </g>
        ))}
      </svg>
    </Box>
  );
};
