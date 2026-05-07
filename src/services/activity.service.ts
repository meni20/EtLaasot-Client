import axios from "axios";
import type { AxiosInstance } from "axios";
import type {
  IActivityAdminFilters,
  IVolunteerActivity,
  IYearlyVolunteerSummary,
} from "../interfaces/activity.interface";

export class ActivityService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_SERVER_URL}/activity`,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
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
}

const activityService = new ActivityService();
export default activityService;

