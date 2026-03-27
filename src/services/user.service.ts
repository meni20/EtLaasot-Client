import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { IUserFormData } from "../interfaces/user.interface";
import { getAuthToken } from "../constants/auth.const";

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

export class UserService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: `${apiBaseUrl}/user`,
    });

    this.api.interceptors.request.use(attachAuthorizationHeader);
  }

  public getAllVolunteers = async () => {
    return this.api
      .get("get-all-volunteers")
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  };

  public getAllTreanees = async () => {
    return this.api
      .get("get-all-trainees")
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  };

  async createVolunteer(userData: IUserFormData) {
    const res = await this.api.post("/create-volunteer", userData);
    return res.data;
  }

  async createTrainee(userData: IUserFormData) {
    const res = await this.api.post("/create-trainee", userData);
    return res.data;
  }

  public getAllUsers = async () => {
    return this.api
      .get("/get-all")
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  };
}

const userService = new UserService();
export default userService;
