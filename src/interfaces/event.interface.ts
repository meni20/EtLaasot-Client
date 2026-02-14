import type { IUser } from "./user.interface";

export interface IEvent {
  id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  address: string;
  description?: string;
  attendees?: IAttendees[];
}

export interface IAttendees {
  userId: string;
  eventId: string;
  user: IUser;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}
