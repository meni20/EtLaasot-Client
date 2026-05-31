import type { IEvent } from "./event.interface";

export interface IUser {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  age: number;
  branchId?: string;
  userRoles?: IUserRole[];
  events?: IEvent[];

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface IUserRole {
  roleId: number;
  resourceId?: string;
  branchId?: string;
  branchName?: string;
  role?: string;
}

export interface ICurrentUserProfile {
  id: string;
  name: string;
  phoneNumber?: string | null;
  address?: string | null;
  email?: string | null;
  age?: number | null;
  branchId?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IUpdateCurrentUserProfilePayload {
  email?: string | null;
  phoneNumber?: string;
  address?: string | null;
}
