import type { AxiosInstance } from "axios";
import { createServerAxiosInstance } from "../config/axiosInstance";

export type PushSubscriptionPayload = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

class PushNotificationService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = createServerAxiosInstance("/push-notifications");
  }

  async getPublicKey(): Promise<string> {
    const response = await this.api.get<{ publicKey: string }>("/public-key");
    return response.data.publicKey;
  }

  async register(subscription: PushSubscriptionPayload): Promise<void> {
    await this.api.put("/subscription", subscription);
  }

  async remove(endpoint: string): Promise<void> {
    await this.api.delete("/subscription", { data: { endpoint } });
  }

  async sendSelfTest(): Promise<{ message: string; delivered: number }> {
    const response = await this.api.post<{
      message: string;
      delivered: number;
    }>("/test");
    return response.data;
  }
}

export default new PushNotificationService();
