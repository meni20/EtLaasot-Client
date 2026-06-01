import type { IUser } from "./user.interface";

export interface IEvent {
  id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  address: string;
  description?: string;
  eventType?: string;
  branchId?: string;
  attendees?: IAttendees[];
}

export interface IAttendees {
  id?: string;
  userId: string;
  eventId: string;
  rsvpStatus?: AttendeeRsvpStatus;
  rsvpDate?: Date;
  checkedIn?: boolean;
  checkedInAt?: Date;
  checkedInBy?: string;
  notes?: string;
  user: IUser;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventPairing {
  id: string;
  eventId: string;
  mentorId: string;
  traineeId: string;
  mentor?: IUser;
  trainee?: IUser;
}

export interface IEventParticipants {
  paired: IEventPairing[];
  unpairedMentors: IAttendees[];
  unpairedTrainees: IAttendees[];
}

export type AttendanceIntent =
  | "BOTH"
  | "VOLUNTEER_ONLY"
  | "TRAINEE_ONLY"
  | "NONE";

export type AttendeeRsvpStatus = "pending" | "confirmed" | "declined";

export interface IBranch {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export interface IMentorAssignment {
  id: string;
  mentorId: string;
  traineeId: string;
  branchId: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  mentor?: IUser;
  trainee?: IUser;
}

export interface IDashboardData {
  summary: {
    totalVolunteers: number;
    totalTrainees: number;
    activeEvents: number;
    attendanceRate: number;
    unassignedTrainees: number;
  };
  upcomingEvents: IEvent[];
  monthlyStats: {
    month: string;
    attendanceRate: number;
    totalEvents: number;
    totalAttendees: number;
  }[];
  mentorAssignments: IMentorAssignment[];
  recentAttendance: {
    total: number;
    checkedInCount: number;
    rate: number;
  };
}
