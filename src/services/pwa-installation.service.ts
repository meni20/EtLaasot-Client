import type { AxiosInstance } from "axios";
import { createServerAxiosInstance } from "../config/axiosInstance";
import type { PwaPlatform } from "../utils/pwa-installation.util";

class PwaInstallationService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = createServerAxiosInstance("/pwa-installations");
  }

  async register(installationId: string, platform: PwaPlatform): Promise<void> {
    await this.api.post("/register", { installationId, platform });
  }
}

export default new PwaInstallationService();
