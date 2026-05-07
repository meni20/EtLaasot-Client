import axios from "axios";
import type { AxiosInstance } from "axios";
import type { IBranch, IDashboardData } from "../interfaces/event.interface";

export class BranchService {
    private api: AxiosInstance;
    constructor() {
        this.api = axios.create({
            baseURL: `${import.meta.env.VITE_SERVER_URL}/branch`,
        });
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
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
