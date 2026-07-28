import type { AxiosInstance } from "axios";
import { createServerAxiosInstance } from "../config/axiosInstance";
import type {
  IAttendees,
  ICalendarMonthBackground,
  IEvent,
  IEventAssignmentEmailResult,
  IEventAiInsights,
  IEventParticipants,
} from "../interfaces/event.interface";

export class EventService {
  private api: AxiosInstance;
  constructor() {
    this.api = createServerAxiosInstance("/event");
  }

  public async createEvent(eventData: IEvent) {
    const res = await this.api.post("/create-event", eventData);
    return res.data;
  }

  public async uploadEventImage(eventId: string, image: File): Promise<IEvent> {
    const formData = new FormData();
    formData.append("image", image);

    const res = await this.api.put(`/${eventId}/image`, formData);
    return res.data;
  }

  public async removeEventImage(eventId: string): Promise<IEvent> {
    const res = await this.api.delete(`/${eventId}/image`);
    return res.data;
  }

  public async getCalendarMonthBackground(
    branchId: string,
    monthKey: string,
  ): Promise<ICalendarMonthBackground | null> {
    const res = await this.api.get(`/calendar-background/${branchId}/${monthKey}`);
    return res.data;
  }

  public async uploadCalendarMonthBackground(
    branchId: string,
    monthKey: string,
    image: File,
  ): Promise<ICalendarMonthBackground> {
    const formData = new FormData();
    formData.append("image", image);

    const res = await this.api.put(
      `/calendar-background/${branchId}/${monthKey}/image`,
      formData,
    );
    return res.data;
  }

  public async removeCalendarMonthBackground(
    branchId: string,
    monthKey: string,
  ): Promise<{ ok: boolean }> {
    const res = await this.api.delete(
      `/calendar-background/${branchId}/${monthKey}/image`,
    );
    return res.data;
  }

  public async getEventAiInsights(eventId: string): Promise<IEventAiInsights> {
    const res = await this.api.get(`/${eventId}/ai-insights`);
    return res.data;
  }

  public async generateEventAiSummary(
    eventId: string,
  ): Promise<IEventAiInsights> {
    const res = await this.api.post(`/${eventId}/generate-ai-summary`);
    return res.data;
  }

  public async sendEventAssignments(
    eventId: string,
  ): Promise<IEventAssignmentEmailResult> {
    const res = await this.api.post(`/${eventId}/send-assignments`);
    return res.data;
  }

  public async getAllEvents(branchId?: string) {
    const res = await this.api.get("/get-all-events", {
      params: branchId ? { branchId } : {},
    });
    return res.data;
  }

  public async getUpcomingEvents(branchId: string, limit = 5) {
    const res = await this.api.get(`/upcoming/${branchId}`, {
      params: { limit },
    });
    return res.data;
  }

  public async addAttendeeToEvent(userId: string, eventId: string) {
    const res = await this.api.post("/add-attendee", { userId, eventId });
    return res.data;
  }

  public async getEventAttendees(eventId: string): Promise<IAttendees[]> {
    const res = await this.api.get(`/get-attendees-by-event/${eventId}`);
    return res.data;
  }

  public async getEventParticipants(
    eventId: string,
  ): Promise<IEventParticipants> {
    const res = await this.api.get(`/${eventId}/participants`);
    return res.data;
  }

  public async createEventPairing(
    eventId: string,
    mentorId: string,
    traineeId: string,
  ): Promise<IEventParticipants> {
    const res = await this.api.post(`/${eventId}/pairings`, {
      mentorId,
      traineeId,
    });
    return res.data;
  }

  public async deleteEventPairing(
    eventId: string,
    pairingId: string,
  ): Promise<IEventParticipants> {
    const res = await this.api.delete(`/${eventId}/pairings/${pairingId}`);
    return res.data;
  }

  public async updateEvent(eventId: string, eventData: IEvent) {
    const res = await this.api.put(`/update-event/${eventId}`, eventData);
    return res.data;
  }
}

const eventService = new EventService();
export default eventService;
