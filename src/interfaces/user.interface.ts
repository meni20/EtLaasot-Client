import type { IEvent } from "./event.interface";

export type UserGender = "male" | "female";
export type ShirtSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "OTHER";

export interface IUser {
  id: string;
  name: string;
  phoneNumber: string;
  gender?: UserGender | "" | null;
  address: string;
  email: string | null;
  age?: number | null;
  dateOfBirth?: string | null;
  shirtSize?: ShirtSize | "" | null;
  customShirtSize?: string | null;
  notes?: string | null;
  parentName?: string | null;
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
  gender?: UserGender | null;
  address?: string | null;
  email?: string | null;
  age?: number | null;
  dateOfBirth?: string | null;
  shirtSize?: ShirtSize | null;
  customShirtSize?: string | null;
  branchId?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IUpdateCurrentUserProfilePayload {
  email?: string | null;
  phoneNumber?: string;
  address?: string | null;
}

export interface IUpdateUserPayload {
  name: string;
  dateOfBirth?: string | null;
  gender?: UserGender | null;
  shirtSize?: ShirtSize | null;
  customShirtSize?: string | null;
  notes?: string | null;
  parentName?: string | null;
  phoneNumber: string;
  email?: string | null;
  address?: string | null;
}
