import { useAuth } from "../../contexts/useAuth";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBranch } from "../../contexts/useBranch";
import eventService from "../../services/event.service";
import type { IEvent } from "../../interfaces/event.interface";

const EMPTY_EVENTS: IEvent[] = [];

export const useMobileEvents = () => {
  const { user, sessionId } = useAuth();
  const { activeBranch } = useBranch();

  const {
    data: fetchedEvents = EMPTY_EVENTS,
    isLoading,
    error,
    refetch,
  } = useQuery<IEvent[]>({
    queryKey: ["events", activeBranch, user?.userId, sessionId],
    queryFn: ({ signal }) =>
      eventService.getAllEvents(activeBranch ?? undefined, signal),
    enabled: !!activeBranch,
  });

  const allEvents = error ? EMPTY_EVENTS : fetchedEvents;
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
