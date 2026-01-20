import axios from "axios";
import type { AxiosInstance } from "axios";
import type { IEvent } from "../interfaces/event.interface";

export class EventService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:3000/event",
    });
  }

  public async createEvent(eventData: IEvent) {
    try {
      const res = await this.api.post("/create-event", eventData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }

  public async getAllEvents() {
    try {
      const res = await this.api.get("get-all-events");
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async addAttendeeToEvent(userId: string, eventId: string) {
    try {
      const res = await this.api.post("/add-attendee", { userId, eventId });
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async getEventAttendees(eventId: string) {
    try {
      const res = await this.api.post(`/get-attendees-by-event/${eventId}`)
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

const eventService = new EventService();
export default eventService;
