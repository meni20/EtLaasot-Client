import type { AxiosInstance } from "axios";
import { createServerAxiosInstance } from "../config/axiosInstance";

export class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = createServerAxiosInstance("/auth");
  }

  public async login(userId: string, loginCode: string) {
    const res = await this.api.post('/login', {
      userId,
      loginCode,
    });

    return res.data;
  }

  public async getMe() {
    const res = await this.api.get('/me');

    return res.data;
  }

  public async logout() {
    const res = await this.api.post('/logout');
    return res.data;
  }
}

const authService = new AuthService();
export default authService;
