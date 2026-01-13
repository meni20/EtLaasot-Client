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
          const res = await this.api
              .post("/create-event", eventData);
          return res.data;
      } catch (err) {
          console.log(err);
      }
  }
}

const eventService = new EventService();
export default eventService;