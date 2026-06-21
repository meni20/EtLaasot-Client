import type { AxiosInstance } from "axios";
import { createServerAxiosInstance } from "../config/axiosInstance";
import type {
  IAttendees,
  IEvent,
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
