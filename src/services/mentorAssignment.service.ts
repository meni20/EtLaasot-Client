import type { AxiosInstance } from "axios";
import type { IMentorAssignment } from "../interfaces/event.interface";
import type { IUser } from "../interfaces/user.interface";
import { createServerAxiosInstance } from "../config/axiosInstance";

export class MentorAssignmentService {
    private api: AxiosInstance;
    constructor() {
        this.api = createServerAxiosInstance("/mentor-assignment");
    }

    public async getAssignmentsByBranch(
        branchId: string
    ): Promise<IMentorAssignment[]> {
        const res = await this.api.get(`/${branchId}`);
        return res.data;
    }

    public async getMyTrainees(): Promise<IMentorAssignment[]> {
        const res = await this.api.get("/my-trainees");
        return res.data;
    }

    public async getUnassignedTrainees(branchId: string): Promise<IUser[]> {
        const res = await this.api.get(`/${branchId}/unassigned`);
        return res.data;
    }

    public async assignTrainee(data: {
        mentorId: string;
        traineeId: string;
        branchId: string;
    }): Promise<IMentorAssignment> {
        const res = await this.api.post("/assign", data);
        return res.data;
    }

    public async removeAssignment(assignmentId: string): Promise<void> {
        await this.api.delete(`/${assignmentId}`);
    }

    public async transferTrainee(
        assignmentId: string,
        newMentorId: string
    ): Promise<IMentorAssignment> {
        const res = await this.api.put(`/${assignmentId}/transfer`, {
            newMentorId,
        });
        return res.data;
    }
}

const mentorAssignmentService = new MentorAssignmentService();
export default mentorAssignmentService;
