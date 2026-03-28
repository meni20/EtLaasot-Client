import axios from "axios";
import type { AxiosInstance } from "axios";
import type { IUser } from "../interfaces/user.interface";

export class UserService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_SERVER_URL}/user`,
    });
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  public getAllVolunteers = async (branchId?: string) => {
    const res = await this.api.get("/get-all-volunteers", {
      params: branchId ? { branchId } : {},
    });
    return res.data;
  };

  public getAllTrainees = async (branchId?: string) => {
    const res = await this.api.get("/get-all-trainees", {
      params: branchId ? { branchId } : {},
    });
    return res.data;
  };

  async createVolunteer(userData: IUser) {
    const res = await this.api.post("/create-volunteer", userData);
    return res.data;
  }

  async createTrainee(userData: IUser) {
    const res = await this.api.post("/create-trainee", userData);
    return res.data;
  }

  public getAllUsers = async (branchId?: string) => {
    const res = await this.api.get("/get-all", {
      params: branchId ? { branchId } : {},
    });
    return res.data;
  };

  public getUserById = async (userId: string) => {
    const res = await this.api.get(`/${userId}`);
    return res.data;
  };
}

const userService = new UserService();
export default userService;
