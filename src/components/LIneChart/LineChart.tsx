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
  const chartSummary = visibleEvents
    .map((event) => `${event.name}: ${event.participantCount}`)
    .join(", ");

  if (visibleEvents.length === 0) {
    return (
      <Box
        sx={{
          height: emptyHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-md)",
          border: "1px dashed var(--color-border)",
          backgroundColor: "var(--color-surface-muted)",
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "var(--color-text-secondary)",
            fontFamily: "inherit",
            fontSize: "0.92rem",
            fontWeight: 600,
          }}
        >
          אין אירועים להצגה בגרף.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      role="group"
      aria-label={`משתתפים לפי אירוע. ${chartSummary}`}
      sx={{
        height,
        width: "100%",
        minHeight: 180,
        display: "grid",
        gridTemplateColumns: "42px minmax(0, 1fr)",
        gap: 1.75,
        direction: "ltr",
        overflow: "hidden",
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
          color: "var(--color-text-muted)",
          fontFamily: "inherit",
          fontSize: 11,
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
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
          borderBottom: "1px solid var(--color-border)",
          backgroundImage:
            "linear-gradient(to bottom, var(--color-border-subtle) 1px, transparent 1px)",
          backgroundSize: "100% calc((100% - 58px) / 2)",
          backgroundRepeat: "repeat-y",
        }}
      >
        <Box
          role="list"
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${visibleEvents.length}, minmax(52px, 1fr))`,
            alignItems: "end",
            gap: 1.5,
            px: 0.5,
            pt: 1,
            overflow: "hidden",
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
                  role="listitem"
                  tabIndex={0}
                  aria-label={tooltip}
                  sx={{
                    height: "100%",
                    minWidth: 0,
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                    "&:hover .line-chart-bar, &:focus-visible .line-chart-bar": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 22px rgba(47, 111, 97, 0.2)",
                    },
                    "&:focus-visible": {
                      boxShadow: "0 0 0 3px rgba(47, 111, 97, 0.22)",
                    },
                  }}
                >
                  <Box
                    className="line-chart-bar"
                    sx={{
                      width: "100%",
                      maxWidth: 46,
                      height: `${heightPercent}%`,
                      minHeight: 4,
                      borderRadius: "10px 10px 3px 3px",
                      background:
                        "linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
                      boxShadow: "0 8px 18px rgba(47, 111, 97, 0.16)",
                      transition:
                        "height var(--transition-normal), transform var(--transition-fast), box-shadow var(--transition-fast)",
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
                  color: "var(--color-text-secondary)",
                  fontFamily: "inherit",
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
