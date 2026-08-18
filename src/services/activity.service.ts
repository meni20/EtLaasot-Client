import axios, { type AxiosInstance } from "axios";
import { createServerAxiosInstance } from "../config/axiosInstance";
import type {
  IActivityAdminFilters,
  IEventActivityAttendance,
  IVolunteerActivity,
  IYearlyVolunteerSummary,
} from "../interfaces/activity.interface";

export class ActivityService {
  private api: AxiosInstance;

  constructor() {
    this.api = createServerAxiosInstance("/activity");
  }

  public async startActivity(data: { eventId: string; traineeId: string }) {
    const res = await this.api.post<IVolunteerActivity>("/start", data);
    return res.data;
  }

  public async endActivity(activityId: string, notes?: string) {
    const res = await this.api.patch<IVolunteerActivity>(`/end/${activityId}`, {
      notes,
    });
    return res.data;
  }

  public async getMyActiveActivity() {
    const res = await this.api.get<IVolunteerActivity | null>("/my-active");
    return res.data;
  }

  public async getMyHistory(limit = 20) {
    const res = await this.api.get<IVolunteerActivity[]>("/my-history", {
      params: { limit },
    });
    return res.data;
  }

  public async getMyYearlySummary() {
    const res = await this.api.get<IYearlyVolunteerSummary>(
      "/my-yearly-summary",
    );
    return res.data;
  }

  public async getAdminActivities(filters: IActivityAdminFilters) {
    const res = await this.api.get<IVolunteerActivity[]>("/admin", {
      params: filters,
    });
    return res.data;
  }

  public async getEventAttendance(eventId: string) {
    const trimmedEventId = eventId.trim();
    const normalizedEventId = encodeURIComponent(trimmedEventId);

    try {
      const res = await this.api.get<IEventActivityAttendance[]>(
        `/event/${normalizedEventId}/attendance`,
      );
      return res.data;
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 404) {
        throw error;
      }

      const res = await this.api.get<IVolunteerActivity[]>("/admin", {
        params: { eventId: trimmedEventId },
      });

      return this.toUniqueEventAttendance(res.data);
    }
  }

  public async removeEventAttendance(eventId: string, volunteerId: string) {
    const normalizedEventId = encodeURIComponent(eventId.trim());
    const normalizedVolunteerId = encodeURIComponent(volunteerId.trim());
    const res = await this.api.delete<IEventActivityAttendance[]>(
      `/event/${normalizedEventId}/attendance/${normalizedVolunteerId}`,
    );
    return res.data;
  }

  private toUniqueEventAttendance(activities: IVolunteerActivity[]) {
    const attendanceByVolunteer = new Map<string, IEventActivityAttendance>();

    activities.forEach((activity) => {
      if (
        !activity.volunteerId ||
        !["ACTIVE", "COMPLETED"].includes(activity.status) ||
        attendanceByVolunteer.has(activity.volunteerId)
      ) {
        return;
      }

      attendanceByVolunteer.set(activity.volunteerId, {
        volunteerId: activity.volunteerId,
        name: activity.volunteer?.name ?? activity.volunteerId,
      });
    });

    return Array.from(attendanceByVolunteer.values()).sort((first, second) =>
      first.name.localeCompare(second.name, "he"),
    );
  }
}

const activityService = new ActivityService();
export default activityService;

