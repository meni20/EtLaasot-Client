import type { AxiosInstance } from "axios";
import { createServerAxiosInstance } from "../config/axiosInstance";
import type { ISuperAdminDashboardData } from "../interfaces/dashboard.interface";

export class DashboardService {
  private api: AxiosInstance;

  constructor() {
    this.api = createServerAxiosInstance("/dashboard");
  }

  public async getSuperAdminDashboard(): Promise<ISuperAdminDashboardData> {
    const response = await this.api.get("/super-admin");
    return response.data;
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
