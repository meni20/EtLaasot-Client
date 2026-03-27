import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { IEvent } from "../interfaces/event.interface";
import { getAuthToken } from "../constants/auth.const";

type ApiErrorResponse = {
  message?: string;
};

const serverUrl = import.meta.env.VITE_SERVER_URL?.trim();

if (!serverUrl) {
  throw new Error("Missing VITE_SERVER_URL environment variable.");
}

const apiBaseUrl = serverUrl.replace(/\/$/, "");

const attachAuthorizationHeader = (config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    config.headers.delete("Authorization");
  }

  return config;
};

const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message || fallbackMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

export class EventService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: `${apiBaseUrl}/event`,
    });

    this.api.interceptors.request.use(attachAuthorizationHeader);
  }

  public async createEvent(eventData: IEvent) {
    try {
      const res = await this.api.post("/create-event", eventData);
      return res.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Failed to create event."));
    }
  }

  public async getAllEvents() {
    try {
      const res = await this.api.get("get-all-events");
      return res.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Failed to load events."));
    }
  }

  public async addAttendeeToEvent(userId: string, eventId: string) {
    try {
      const res = await this.api.post("/add-attendee", { userId, eventId });
      return res.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "Failed to add attendee to the event.")
      );
    }
  }

  public async getEventAttendees(eventId: string) {
    try {
      const res = await this.api.post(`/get-attendees-by-event/${eventId}`);
      return res.data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "Failed to load event attendees.")
      );
    }
  }
}

const eventService = new EventService();
export default eventService;
