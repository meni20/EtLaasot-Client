import React, { Suspense, lazy, useMemo, useState } from "react";
import { Box, Typography, CircularProgress, IconButton, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import branchService from "../../../services/branch.service";
import { useBranch } from "../../../contexts/useBranch";
import { useDashboardStyles } from "./Dashboard.styles";
import { menuItems } from "../../../components/SideMenu/SideMenu.constants";
import { BasicCard } from "../../../components/Card/Card";
import { CreateEvent } from "../../../components/CreateEvent/CreateEvent";
import type { IDashboardData, IEvent } from "../../../interfaces/event.interface";

const DASHBOARD_CAROUSEL_VISIBLE_EVENTS = 3;
const LineChart = lazy(() =>
  import("../../../components/LIneChart/LineChart").then((module) => ({
    default: module.LineChart,
  })),
);

export const DashboardPage: React.FC = () => {
  const classes = useDashboardStyles();
  const navigate = useNavigate();
  const { activeBranch, availableBranches } = useBranch();
  const [carouselStart, setCarouselStart] = useState(0);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

  const branchName = useMemo(
    () => availableBranches.find((b) => b.id === activeBranch)?.name ?? "",
    [activeBranch, availableBranches],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useQuery<IDashboardData>({
    queryKey: ["dashboard", activeBranch],
    queryFn: () => branchService.getDashboard(activeBranch!),
    enabled: !!activeBranch,
  });

  const dashboardUpcomingEvents = useMemo(() => {
    const now = Date.now();

    return [...(data?.upcomingEvents ?? [])]
      .filter((event) => new Date(event.startDate).getTime() >= now)
      .sort(
        (firstEvent, secondEvent) =>
          new Date(firstEvent.startDate).getTime() -
          new Date(secondEvent.startDate).getTime(),
      );
  }, [data?.upcomingEvents]);

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

  if (isError) {
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
          לא הצלחנו לטעון את נתוני הדשבורד.
        </Typography>
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

  const { summary } = data;
  const maxCarouselStart = Math.max(
    dashboardUpcomingEvents.length - DASHBOARD_CAROUSEL_VISIBLE_EVENTS,
    0,
  );
  const effectiveCarouselStart = Math.min(carouselStart, maxCarouselStart);
  const visibleUpcomingEvents = dashboardUpcomingEvents.slice(
    effectiveCarouselStart,
    effectiveCarouselStart + DASHBOARD_CAROUSEL_VISIBLE_EVENTS,
  );
  const hasCarouselControls =
    dashboardUpcomingEvents.length > DASHBOARD_CAROUSEL_VISIBLE_EVENTS;

  const handlePreviousEvents = () => {
    setCarouselStart((currentStart) => Math.max(currentStart - 1, 0));
  };

  const handleNextEvents = () => {
    setCarouselStart((currentStart) =>
      Math.min(currentStart + 1, maxCarouselStart),
    );
  };

  const dashboardRoutes = {
    volunteers:
      menuItems.find((item) => item.path === "/volunteers")?.path ??
      "/volunteers",
    trainees:
      menuItems.find((item) => item.path === "/trainee")?.path ?? "/trainee",
    events: menuItems.find((item) => item.path === "/events")?.path ?? "/events",
    mentorAssignments:
      menuItems.find((item) => item.path === "/mentor-assignments")?.path ??
      "/mentor-assignments",
  };
  const alerts: { type: string; message: string }[] = [];

  if (summary.unassignedTrainees > 0) {
    alerts.push({
      type: "warning",
      message: `${summary.unassignedTrainees} חניכים ללא חונך מוקצה`,
    });
  }

  if (summary.activeEvents === 0) {
    alerts.push({
      type: "error",
      message: "אין אירועים קרובים",
    });
  }

  const alertClass = (type: string) => {
    switch (type) {
      case "warning":
        return `${classes.alertItem} ${classes.alertWarning}`;
      case "error":
        return `${classes.alertItem} ${classes.alertError}`;
      default:
        return `${classes.alertItem} ${classes.alertInfo}`;
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" className={classes.title}>
          {branchName} - בית
        </Typography>
      </Box>

      <Box className={classes.summaryGrid}>
        <Box
          className={classes.summaryCard}
          onClick={() => navigate(dashboardRoutes.volunteers)}
        >
          <Box className={classes.summaryIcon}>👥</Box>
          <Box className={classes.summaryValue}>{summary.totalVolunteers}</Box>
          <Box className={classes.summaryLabel}>מתנדבים</Box>
        </Box>

        <Box
          className={classes.summaryCard}
          onClick={() => navigate(dashboardRoutes.trainees)}
        >
          <Box className={classes.summaryIcon}>🎓</Box>
          <Box className={classes.summaryValue}>{summary.totalTrainees}</Box>
          <Box className={classes.summaryLabel}>חניכים</Box>
        </Box>

        <Box
          className={classes.summaryCard}
          onClick={() => navigate(dashboardRoutes.events)}
        >
          <Box className={classes.summaryIcon}>📅</Box>
          <Box className={classes.summaryValue}>{summary.activeEvents}</Box>
          <Box className={classes.summaryLabel}>אירועים קרובים</Box>
        </Box>

        <Box
          className={classes.summaryCard}
          onClick={() => navigate(dashboardRoutes.mentorAssignments)}
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

      {alerts.length > 0 && (
        <Box className={classes.tableCard}>
          <Typography className={classes.chartTitle}>התראות חשובות</Typography>
          <Box className={classes.alertsContainer}>
            {alerts.map((alert, index) => (
              <Box key={`${alert.type}-${index}`} className={alertClass(alert.type)}>
                {alert.message}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {dashboardUpcomingEvents.length > 0 && (
        <Box className={classes.upcomingSection}>
          <Box className={classes.carouselHeader}>
            <Typography className={classes.chartTitle}>אירועים קרובים</Typography>
            {hasCarouselControls && (
              <Box className={classes.carouselControls}>
                <Tooltip title="אירועים קודמים">
                  <span>
                    <IconButton
                      className={classes.carouselButton}
                      onClick={handlePreviousEvents}
                      disabled={effectiveCarouselStart === 0}
                      size="small"
                    >
                      <ChevronRightIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="אירועים נוספים">
                  <span>
                    <IconButton
                      className={classes.carouselButton}
                      onClick={handleNextEvents}
                      disabled={effectiveCarouselStart >= maxCarouselStart}
                      size="small"
                    >
                      <ChevronLeftIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            )}
          </Box>

          <Box className={classes.eventsCarouselViewport}>
            <Box className={classes.eventsCarouselTrack}>
              {visibleUpcomingEvents.map((event) => (
                <Box key={event.id} className={classes.carouselCard}>
                  <BasicCard
                    eventId={event.id ?? ""}
                    eventName={event.name}
                    startDate={event.startDate}
                    endDate={event.endDate}
                    address={event.address}
                    description={event.description}
                    eventType={event.eventType}
                    participantsCount={event.attendees?.length}
                    onEdit={() => {
                      setSelectedEvent(event);
                      setIsEventFormOpen(true);
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      <Box className={classes.chartCard}>
        <Typography className={classes.chartTitle}>
          משתתפים לפי אירוע
        </Typography>
        <Suspense
          fallback={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={160}
            >
              <CircularProgress size={24} sx={{ color: "#9a5188" }} />
            </Box>
          }
        >
          <LineChart height={220} emptyHeight={160} />
        </Suspense>
      </Box>

      {isEventFormOpen && (
        <CreateEvent
          open={isEventFormOpen}
          onClose={() => {
            setIsEventFormOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      )}
    </Box>
  );
};
