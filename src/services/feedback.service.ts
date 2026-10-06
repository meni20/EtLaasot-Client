import type { AxiosInstance } from "axios";
import { createServerAxiosInstance } from "../config/axiosInstance";

export interface FeatureRequestPayload {
  title: string;
  description: string;
}

class FeedbackService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = createServerAxiosInstance("/feedback");
  }

  async submitFeatureRequest(payload: FeatureRequestPayload): Promise<void> {
    await this.api.post("/feature-request", payload);
  }
}

export default new FeedbackService();
