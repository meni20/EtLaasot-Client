import type { IBranch, IEvent } from "./event.interface";
import type { IUser } from "./user.interface";

export type ActivityStatus = "ACTIVE" | "COMPLETED";

export interface IVolunteerActivity {
  id: string;
  volunteerId: string;
  traineeId: string;
  eventId: string;
  branchId?: string | null;
  startTime: string;
  endTime?: string | null;
  status: ActivityStatus;
  notes?: string;
  durationMinutes: number | null;
  durationFormatted: string | null;
  timezone: string;
  volunteer?: IUser;
  trainee?: IUser;
  event?: IEvent;
  branch?: IBranch;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEventActivityAttendance {
  volunteerId: string;
  name: string;
}

export interface IYearlyVolunteerSummary {
  totalMinutes: number;
  totalHoursDecimal: number;
  formatted: string;
  year: number;
  timezone: string;
}

export interface IActivityAdminFilters {
  volunteerId?: string;
  traineeId?: string;
  eventId?: string;
  branchId?: string;
  status?: ActivityStatus;
  startDate?: string;
  endDate?: string;
}

