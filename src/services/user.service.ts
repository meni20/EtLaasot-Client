import type { AxiosInstance } from "axios";
import type {
  ICurrentUserProfile,
  IUpdateCurrentUserProfilePayload,
  IUpdateUserPayload,
  IUser,
} from "../interfaces/user.interface";
import { createServerAxiosInstance } from "../config/axiosInstance";

export interface ITemporaryPasswordResponse {
  temporaryPassword: string;
  temporaryPasswordExpiresAt: string;
}

export interface ICreateUserResponse extends ITemporaryPasswordResponse {
  user: IUser;
}

export interface IArchiveUserResponse {
  id: string;
  isActive: boolean;
  archivedAt: string | null;
  archivedBy: string | null;
  archiveReason: string | null;
}

export type UserListStatus = "active" | "archived" | "all";

export class UserService {
  private api: AxiosInstance;
  constructor() {
    this.api = createServerAxiosInstance("/user");
  }

  public getAllVolunteers = async (
    branchId?: string,
    status: UserListStatus = "active",
  ) => {
    const res = await this.api.get("/get-all-volunteers", {
      params: { ...(branchId ? { branchId } : {}), status },
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

  public getAllTrainees = async (
    branchId?: string,
    status: UserListStatus = "active",
  ) => {
    const res = await this.api.get("/get-all-trainees", {
      params: { ...(branchId ? { branchId } : {}), status },
    });
    return res.data;
  };

  async createVolunteer(userData: IUser): Promise<ICreateUserResponse> {
    const res = await this.api.post("/create-volunteer", userData);
    return res.data;
  }

  async createTrainee(userData: IUser): Promise<ICreateUserResponse> {
    const res = await this.api.post("/create-trainee", userData);
    return res.data;
  }

  async resetPassword(userId: string): Promise<ITemporaryPasswordResponse> {
    const res = await this.api.patch(`/${userId}/password-reset`);
    return res.data;
  }

  async archiveUser(userId: string, reason?: string | null) {
    const res = await this.api.patch<IArchiveUserResponse>(
      `/${userId}/archive`,
      {
        reason,
      },
    );
    return res.data;
  }

  async restoreUser(userId: string) {
    const res = await this.api.patch<IArchiveUserResponse>(
      `/${userId}/restore`,
    );
    return res.data;
  }

  public getAllUsers = async (
    branchId?: string,
    status: UserListStatus = "active",
  ) => {
    const res = await this.api.get("/get-all", {
      params: { ...(branchId ? { branchId } : {}), status },
    });
    return res.data;
  };

  public getUserById = async (userId: string) => {
    const res = await this.api.get(`/${userId}`);
    return res.data;
  };

  public getNationalId = async (
    nationalIdRevealId: string,
  ): Promise<{ nationalId: string }> => {
    const res = await this.api.get(`/${nationalIdRevealId}/national-id`);
    return res.data;
  };

  public updateUser = async (
    userId: string,
    payload: IUpdateUserPayload,
  ): Promise<IUser> => {
    const res = await this.api.patch(`/${userId}`, payload);
    return res.data;
  };
}

const userService = new UserService();
export default userService;
