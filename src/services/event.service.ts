import axios from "axios";
import type { AxiosInstance } from "axios";
import type { IEvent } from "../interfaces/event.interface";

export class EventService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_SERVER_URL}/event`,
    });
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
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

  public async getEventAttendees(eventId: string) {
    const res = await this.api.get(`/get-attendees-by-event/${eventId}`);
    return res.data;
  }
}

const eventService = new EventService();
export default eventService;
