import axios from "axios";
import type { AxiosInstance } from "axios";

export class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
    });
  }

  public async login(userId: string) {
    const res = await this.api.post('/login', {
      userId,
    });

    return res.data;
  }

  public async getMe(token: string) {
    const res = await this.api.get('/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  }
}

const authService = new AuthService();
export default authService;
