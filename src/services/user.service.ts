import type { AxiosInstance } from "axios";
import type {
  ICurrentUserProfile,
  IUpdateCurrentUserProfilePayload,
  IUser,
} from "../interfaces/user.interface";
import { createServerAxiosInstance } from "../config/axiosInstance";

export class UserService {
  private api: AxiosInstance;
  constructor() {
    this.api = createServerAxiosInstance("/user");
  }

  public getAllVolunteers = async (branchId?: string) => {
    const res = await this.api.get("/get-all-volunteers", {
      params: branchId ? { branchId } : {},
    });
    return res.data;
  };

  public getMe = async (): Promise<ICurrentUserProfile> => {
    const res = await this.api.get("/me");
    return res.data;
  };

  public updateMe = async (
    payload: IUpdateCurrentUserProfilePayload,
  ): Promise<ICurrentUserProfile> => {
    const res = await this.api.patch("/me", payload);
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
