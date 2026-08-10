import type { AxiosInstance } from "axios";
import { createServerAxiosInstance } from "../config/axiosInstance";
import type {
  ITraineeMedication,
  ITraineeMedicationPayload,
} from "../interfaces/trainee-medication.interface";

class TraineeMedicationService {
  private api: AxiosInstance;
  private selfApi: AxiosInstance;

  constructor() {
    this.api = createServerAxiosInstance("/trainee");
    this.selfApi = createServerAxiosInstance("/user/me/medications");
  }

  public async getByTrainee(
    traineeUuid: string,
  ): Promise<ITraineeMedication[]> {
    const response = await this.api.get(`/${traineeUuid}/medications`);
    return response.data;
  }

  public async create(
    traineeUuid: string,
    payload: ITraineeMedicationPayload,
  ): Promise<ITraineeMedication> {
    const response = await this.api.post(
      `/${traineeUuid}/medications`,
      payload,
    );
    return response.data;
  }

  public async update(
    traineeUuid: string,
    medicationId: string,
    payload: ITraineeMedicationPayload,
  ): Promise<ITraineeMedication> {
    const response = await this.api.patch(
      `/${traineeUuid}/medications/${medicationId}`,
      payload,
    );
    return response.data;
  }

  public async remove(traineeUuid: string, medicationId: string) {
    const response = await this.api.delete(
      `/${traineeUuid}/medications/${medicationId}`,
    );
    return response.data;
  }

  public async getMine(): Promise<ITraineeMedication[]> {
    const response = await this.selfApi.get("");
    return response.data;
  }

  public async createMine(
    payload: ITraineeMedicationPayload,
  ): Promise<ITraineeMedication> {
    const response = await this.selfApi.post("", payload);
    return response.data;
  }

  public async updateMine(
    medicationId: string,
    payload: ITraineeMedicationPayload,
  ): Promise<ITraineeMedication> {
    const response = await this.selfApi.patch(`/${medicationId}`, payload);
    return response.data;
  }

  public async removeMine(medicationId: string) {
    const response = await this.selfApi.delete(`/${medicationId}`);
    return response.data;
  }
}

const traineeMedicationService = new TraineeMedicationService();
export default traineeMedicationService;
