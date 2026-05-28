import type { AxiosInstance } from "axios";
import { createServerAxiosInstance } from "../config/axiosInstance";
import type {
  AttendeeRsvpStatus,
  AttendanceIntent,
  IEventParticipants,
} from "../interfaces/event.interface";

export class AttendeeService {
  private api: AxiosInstance;
  constructor() {
    this.api = createServerAxiosInstance("/attendee");
  }

  public async updateRsvp(
    attendeeId: string,
    rsvpStatus: AttendeeRsvpStatus,
  ) {
    const res = await this.api.put(`/${attendeeId}/rsvp`, { rsvpStatus });
    return res.data;
  }

  public async joinEvent(
    eventId: string,
    rsvpStatus: AttendeeRsvpStatus = "confirmed",
  ) {
    const res = await this.api.post(`/${eventId}/join`, { rsvpStatus });
    return res.data;
  }

  public async updateAttendanceIntent(
    eventId: string,
    intent: AttendanceIntent,
  ): Promise<IEventParticipants> {
    const res = await this.api.post(`/${eventId}/attendance-intent`, {
      intent,
    });
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
