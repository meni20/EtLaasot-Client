import type { AxiosInstance } from "axios";
import type { IBranch, IDashboardData } from "../interfaces/event.interface";
import { createServerAxiosInstance } from "../config/axiosInstance";

export class BranchService {
    private api: AxiosInstance;
    constructor() {
        this.api = createServerAxiosInstance("/branch");
    }

    public async getAllBranches(): Promise<IBranch[]> {
        const res = await this.api.get("/all");
        return res.data;
    }

    public async getBranch(branchId: string): Promise<IBranch> {
        const res = await this.api.get(`/${branchId}`);
        return res.data;
    }

    public async createBranch(data: Partial<IBranch>): Promise<IBranch> {
        const res = await this.api.post("/create", data);
        return res.data;
    }

    public async updateBranch(
        branchId: string,
        data: Partial<IBranch>
    ): Promise<IBranch> {
        const res = await this.api.put(`/${branchId}`, data);
        return res.data;
    }

    public async getDashboard(branchId: string): Promise<IDashboardData> {
        const res = await this.api.get(`/${branchId}/dashboard`);
        return res.data;
    }
}

const branchService = new BranchService();
export default branchService;
