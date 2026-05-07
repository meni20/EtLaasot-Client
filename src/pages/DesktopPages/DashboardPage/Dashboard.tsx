import React, { useMemo } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useQuery } from "@tanstack/react-query";
import branchService from "../../../services/branch.service";
import { useBranch } from "../../../contexts/useBranch";
import { useDashboardStyles } from "./Dashboard.styles";
import { EVENT_TYPES } from "../../../constants/auth.const";
import type { IDashboardData } from "../../../interfaces/event.interface";

export const DashboardPage: React.FC = () => {
  const classes = useDashboardStyles();
  const { activeBranch, availableBranches } = useBranch();

  const branchName = useMemo(
    () => availableBranches.find((b) => b.id === activeBranch)?.name ?? "",
    [activeBranch, availableBranches],
  );

  const { data, isLoading, isFetching } = useQuery<IDashboardData>({
    queryKey: ["dashboard", activeBranch],
    queryFn: () => branchService.getDashboard(activeBranch!),
    enabled: !!activeBranch,
  });

  if (!activeBranch || isLoading || isFetching) {
    return (
      <Box
        className={classes.root}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress sx={{ color: "#9a5188" }} />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box className={classes.root}>
        <Typography
          sx={{
            textAlign: "center",
            mt: 10,
            color: "#999",
            fontFamily: "Rubik, sans-serif",
          }}
        >
          אין נתונים להצגה
        </Typography>
      </Box>
    );
  }

  const { summary, upcomingEvents, monthlyStats, mentorAssignments } = data;

  // Chart 1: Monthly attendance line chart
  const attendanceLineOption = {
    tooltip: { trigger: "axis" as const },
    xAxis: {
      type: "category" as const,
      data: monthlyStats.map((s) => s.month),
    },
    yAxis: { type: "value" as const, name: "% נוכחות", max: 100 },
    series: [
      {
        type: "line" as const,
        data: monthlyStats.map((s) => s.attendanceRate),
        smooth: true,
        color: "#9a5188",
        areaStyle: { opacity: 0.15 },
      },
    ],
  };

  // Chart 2: Event type pie chart
  const eventTypeCounts: Record<string, number> = {};
  upcomingEvents.forEach((e) => {
    const t = e.eventType || "general";
    eventTypeCounts[t] = (eventTypeCounts[t] || 0) + 1;
  });
  const eventTypePieOption = {
    tooltip: { trigger: "item" as const },
    series: [
      {
        type: "pie" as const,
        radius: ["40%", "70%"],
        data: Object.entries(eventTypeCounts).map(([key, value]) => ({
          value,
          name: EVENT_TYPES[key]?.label ?? key,
        })),
        color: [
          "#9a5188",
          "#dc87b8",
          "#7a3e6b",
          "#b76da6",
          "#e6a8d7",
          "#543b4e",
          "#f0d0e5",
        ],
      },
    ],
  };

  // Chart 3: Attendance per event bar chart
  const lastEvents = upcomingEvents.slice(0, 5);
  const attendanceBarOption = {
    tooltip: { trigger: "axis" as const },
    xAxis: { type: "value" as const },
    yAxis: {
      type: "category" as const,
      data: lastEvents.map((e) => e.name),
    },
    series: [
      {
        type: "bar" as const,
        data: lastEvents.map((e) => e.attendees?.length ?? 0),
        color: "#9a5188",
      },
    ],
  };

  // Chart 4: Mentor-trainee ratio
  const mentorCounts: Record<string, number> = {};
  const mentorNames: Record<string, string> = {};
  mentorAssignments.forEach((a) => {
    mentorCounts[a.mentorId] = (mentorCounts[a.mentorId] || 0) + 1;
    if (a.mentor) mentorNames[a.mentorId] = a.mentor.name;
  });
  const mentorRatioOption = {
    tooltip: { trigger: "axis" as const },
    xAxis: { type: "value" as const },
    yAxis: {
      type: "category" as const,
      data: Object.keys(mentorCounts).map((id) => mentorNames[id] || id),
    },
    series: [
      {
        type: "bar" as const,
        data: Object.values(mentorCounts),
        color: "#dc87b8",
      },
    ],
  };

  // Alerts
  const alerts: { type: string; message: string }[] = [];
  if (summary.unassignedTrainees > 0) {
    alerts.push({
      type: "warning",
      message: `${summary.unassignedTrainees} חניכים ללא חונך מוקצה`,
    });
  }
  if (summary.attendanceRate < 70) {
    alerts.push({
      type: "error",
      message: `אחוז נוכחות נמוך — ${summary.attendanceRate}%`,
    });
  }
  if (summary.activeEvents === 0) {
    alerts.push({
      type: "error",
      message: "אין אירועים קרובים",
    });
  }
  if (summary.attendanceRate >= 80) {
    alerts.push({
      type: "success",
      message: `אחוז נוכחות טוב — ${summary.attendanceRate}%`,
    });
  }

  const alertClass = (type: string) => {
    switch (type) {
      case "warning":
        return `${classes.alertItem} ${classes.alertWarning}`;
      case "error":
        return `${classes.alertItem} ${classes.alertError}`;
      case "success":
        return `${classes.alertItem} ${classes.alertSuccess}`;
      default:
        return `${classes.alertItem} ${classes.alertInfo}`;
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" className={classes.title}>
          {branchName} — דשבורד
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box className={classes.summaryGrid}>
        <Box className={classes.summaryCard}>
          <Box className={classes.summaryIcon}>👥</Box>
          <Box className={classes.summaryValue}>{summary.totalVolunteers}</Box>
          <Box className={classes.summaryLabel}>מתנדבים</Box>
        </Box>
        <Box className={classes.summaryCard}>
          <Box className={classes.summaryIcon}>🎓</Box>
          <Box className={classes.summaryValue}>{summary.totalTrainees}</Box>
          <Box className={classes.summaryLabel}>חניכים</Box>
        </Box>
        <Box className={classes.summaryCard}>
          <Box className={classes.summaryIcon}>📅</Box>
          <Box className={classes.summaryValue}>{summary.activeEvents}</Box>
          <Box className={classes.summaryLabel}>אירועים קרובים</Box>
        </Box>
        <Box className={classes.summaryCard}>
          <Box className={classes.summaryIcon}>📊</Box>
          <Box className={classes.summaryValue}>{summary.attendanceRate}%</Box>
          <Box className={classes.summaryLabel}>נוכחות ממוצעת</Box>
        </Box>
        <Box
          className={classes.summaryCard}
          style={
            summary.unassignedTrainees > 0
              ? { borderLeft: "4px solid #e65100" }
              : {}
          }
        >
          <Box className={classes.summaryIcon}>⚠️</Box>
          <Box className={classes.summaryValue}>
            {summary.unassignedTrainees}
          </Box>
          <Box className={classes.summaryLabel}>חניכים ללא חונך</Box>
        </Box>
      </Box>

      {/* Charts */}
      <Box className={classes.chartsGrid}>
        <Box className={classes.chartCard}>
          <Typography className={classes.chartTitle}>
            מגמת נוכחות חודשית
          </Typography>
          <ReactECharts option={attendanceLineOption} style={{ height: 280 }} />
        </Box>
        <Box className={classes.chartCard}>
          <Typography className={classes.chartTitle}>
            התפלגות אירועים לפי סוג
          </Typography>
          <ReactECharts option={eventTypePieOption} style={{ height: 280 }} />
        </Box>
        <Box className={classes.chartCard}>
          <Typography className={classes.chartTitle}>
            נוכחות באירועים אחרונים
          </Typography>
          <ReactECharts option={attendanceBarOption} style={{ height: 280 }} />
        </Box>
        <Box className={classes.chartCard}>
          <Typography className={classes.chartTitle}>יחס חונך/חניך</Typography>
          <ReactECharts option={mentorRatioOption} style={{ height: 280 }} />
        </Box>
      </Box>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Box className={classes.tableCard}>
          <Typography className={classes.chartTitle}>התראות ודגלים</Typography>
          <Box className={classes.alertsContainer}>
            {alerts.map((alert, i) => (
              <Box key={i} className={alertClass(alert.type)}>
                {alert.message}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Upcoming Events Table */}
      <Box className={classes.tableCard}>
        <Typography className={classes.chartTitle}>אירועים קרובים</Typography>
        <Box
          component="table"
          sx={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "Rubik",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "right",
                  padding: "8px 12px",
                  borderBottom: "2px solid #eee",
                  color: "#666",
                }}
              >
                שם האירוע
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "8px 12px",
                  borderBottom: "2px solid #eee",
                  color: "#666",
                }}
              >
                תאריך
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "8px 12px",
                  borderBottom: "2px solid #eee",
                  color: "#666",
                }}
              >
                סוג
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "8px 12px",
                  borderBottom: "2px solid #eee",
                  color: "#666",
                }}
              >
                נרשמו
              </th>
            </tr>
          </thead>
          <tbody>
            {upcomingEvents.map((event) => (
              <tr key={event.id}>
                <td
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  {event.name}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  {new Date(event.startDate).toLocaleDateString("he-IL")}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  {EVENT_TYPES[event.eventType || "general"]?.icon}{" "}
                  {EVENT_TYPES[event.eventType || "general"]?.label}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  {event.attendees?.length ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </Box>
  );
};
