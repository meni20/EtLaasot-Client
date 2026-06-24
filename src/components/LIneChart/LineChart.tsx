import { useMemo } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { useDataContext } from "../../contexts/useDataContext";
import type { IEvent } from "../../interfaces/event.interface";

interface LineChartProps {
  height?: number;
  emptyHeight?: number;
  events?: IEvent[];
  maxEvents?: number;
}

const formatEventDate = (date: Date) =>
  new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);

export const LineChart = ({
  height = 400,
  emptyHeight = 220,
  events: chartEvents,
  maxEvents = 8,
}: LineChartProps) => {
  const { events: contextEvents } = useDataContext();

  const visibleEvents = useMemo(() => {
    return [...(chartEvents ?? contextEvents)]
      .map((event) => ({
        ...event,
        eventDate: new Date(event.startDate),
        participantCount: event.attendees?.length ?? 0,
      }))
      .filter((event) => !Number.isNaN(event.eventDate.getTime()))
      .sort(
        (firstEvent, secondEvent) =>
          firstEvent.eventDate.getTime() - secondEvent.eventDate.getTime(),
      )
      .slice(0, maxEvents);
  }, [chartEvents, contextEvents, maxEvents]);

  const maxParticipants = Math.max(
    ...visibleEvents.map((event) => event.participantCount),
    1,
  );
  const axisValues = [maxParticipants, Math.round(maxParticipants / 2), 0];

  if (visibleEvents.length === 0) {
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
    <Box
      role="img"
      aria-label="משתתפים לפי אירוע"
      sx={{
        height,
        width: "100%",
        minHeight: 180,
        display: "grid",
        gridTemplateColumns: "34px minmax(0, 1fr)",
        gap: 1.5,
        direction: "ltr",
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pt: 1,
          pb: 7.2,
          color: "#6B7280",
          fontFamily: "Rubik, sans-serif",
          fontSize: 11,
          textAlign: "right",
        }}
      >
        {axisValues.map((value, index) => (
          <Box key={`${value}-${index}`}>{value}</Box>
        ))}
      </Box>

      <Box
        sx={{
          minWidth: 0,
          display: "grid",
          gridTemplateRows: "minmax(0, 1fr) 58px",
          borderBottom: "1px solid #E5E0E7",
          backgroundImage:
            "linear-gradient(to bottom, #F2EEF4 1px, transparent 1px)",
          backgroundSize: "100% calc((100% - 58px) / 2)",
          backgroundRepeat: "repeat-y",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${visibleEvents.length}, minmax(52px, 1fr))`,
            alignItems: "end",
            gap: 1.5,
            px: 0.5,
            pt: 1,
          }}
        >
          {visibleEvents.map((event) => {
            const heightPercent =
              event.participantCount === 0
                ? 3
                : Math.max((event.participantCount / maxParticipants) * 100, 8);
            const tooltip = `${event.name} (${formatEventDate(
              event.eventDate,
            )}): ${event.participantCount} משתתפים`;

            return (
              <Tooltip key={event.id ?? event.name} title={tooltip} arrow>
                <Box
                  sx={{
                    height: "100%",
                    minWidth: 0,
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 46,
                      height: `${heightPercent}%`,
                      minHeight: 4,
                      borderRadius: "8px 8px 2px 2px",
                      background:
                        "linear-gradient(180deg, #b76aa5 0%, #9a5188 100%)",
                      boxShadow: "0 6px 14px rgba(154, 81, 136, 0.18)",
                      transition: "height 0.2s ease, transform 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                  />
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${visibleEvents.length}, minmax(52px, 1fr))`,
            gap: 1.5,
            px: 0.5,
            pt: 1,
            direction: "ltr",
          }}
        >
          {visibleEvents.map((event) => (
            <Tooltip
              key={event.id ?? event.name}
              title={`${event.name} - ${formatEventDate(event.eventDate)}`}
              arrow
            >
              <Box
                sx={{
                  minWidth: 0,
                  color: "#4B5563",
                  fontFamily: "Rubik, sans-serif",
                  fontSize: 11,
                  lineHeight: 1.25,
                  textAlign: "center",
                  direction: "rtl",
                  unicodeBidi: "plaintext",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {event.name}
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
