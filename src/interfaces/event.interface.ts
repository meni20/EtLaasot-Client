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
  imagePath?: string | null;
  imageUrl?: string | null;
  aiSummary?: string | null;
  aiSummaryGeneratedAt?: Date | string | null;
  attendees?: IAttendees[];
}

export interface IEventAiNote {
  id: string;
  volunteerName: string | null;
  traineeName: string | null;
  status: string;
  notes: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IEventAiInsights {
  eventId: string;
  aiSummary: string | null;
  aiSummaryGeneratedAt: Date | string | null;
  isAiSummaryOutdated: boolean;
  notes: IEventAiNote[];
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

export interface IRegisteredUserEvent {
  attendeeId: string;
  rsvpStatus?: AttendeeRsvpStatus;
  rsvpDate?: Date | string;
  checkedIn?: boolean;
  event: IEvent & {
    branch?: Pick<IBranch, "id" | "name" | "city" | "address">;
  };
}

export interface ICalendarMonthBackground {
  id: string;
  branchId: string;
  monthKey: string;
  imagePath: string;
  imageUrl: string | null;
  uploadedBy?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
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
