import axios from "axios";
import type { AxiosInstance } from "axios";

export class AttendeeService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_SERVER_URL}/attendee`,
    });
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  public async updateRsvp(attendeeId: string, rsvpStatus: string) {
    const res = await this.api.put(`/${attendeeId}/rsvp`, { rsvpStatus });
    return res.data;
  }

  public async joinEvent(eventId: string, rsvpStatus: string = "confirmed") {
    const res = await this.api.post(`/${eventId}/join`, { rsvpStatus });
    return res.data;
  }

  public async checkIn(attendeeId: string) {
    const res = await this.api.put(`/${attendeeId}/checkin`);
    return res.data;
  }

  public async deleteAttendee(attendeeId: string) {
    const res = await this.api.delete(`/${attendeeId}`);
    return res.data;
  }
}

const attendeeService = new AttendeeService();
export default attendeeService;
