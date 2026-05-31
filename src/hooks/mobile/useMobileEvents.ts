import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBranch } from "../../contexts/useBranch";
import eventService from "../../services/event.service";
import type { IEvent } from "../../interfaces/event.interface";

export const useMobileEvents = () => {
  const { activeBranch } = useBranch();

  const {
    data: allEvents = [],
    isLoading,
    error,
    refetch,
  } = useQuery<IEvent[]>({
    queryKey: ["events", activeBranch],
    queryFn: () => eventService.getAllEvents(activeBranch ?? undefined),
    enabled: !!activeBranch,
  });

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = Date.now();

    return {
      upcomingEvents: [...allEvents]
        .filter((event) => new Date(event.endDate).getTime() >= now)
        .sort(
          (first, second) =>
            new Date(first.startDate).getTime() -
            new Date(second.startDate).getTime(),
        ),
      pastEvents: [...allEvents]
        .filter((event) => new Date(event.endDate).getTime() < now)
        .sort(
          (first, second) =>
            new Date(second.startDate).getTime() -
            new Date(first.startDate).getTime(),
        ),
    };
  }, [allEvents]);

  return {
    allEvents,
    upcomingEvents,
    pastEvents,
    nextEvent: upcomingEvents[0] ?? null,
    isLoading,
    error,
    refetch,
  };
};
