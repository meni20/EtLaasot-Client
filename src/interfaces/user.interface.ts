import type { IEvent } from "./event.interface";
import type { ITraineeMedication } from "./trainee-medication.interface";

export type UserGender = "male" | "female";
export type ShirtSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "OTHER";

export interface IUser {
  id: string;
  nationalIdRevealId?: string | null;
  nationalIdLast4?: string | null;
  nationalIdMasked?: string | null;
  name: string;
  phoneNumber: string;
  gender?: UserGender | "" | null;
  address: string;
  email: string | null;
  age?: number | null;
  dateOfBirth?: string | null;
  shirtSize?: ShirtSize | "" | null;
  customShirtSize?: string | null;
  allergies?: string | null;
  notes?: string | null;
  parentName?: string | null;
  branchId?: string;
  isActive?: boolean;
  archivedAt?: Date | string | null;
  archivedBy?: string | null;
  archiveReason?: string | null;
  userRoles?: IUserRole[];
  events?: IEvent[];
  traineeMedications?: ITraineeMedication[];

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
  nationalIdLast4?: string | null;
  nationalIdMasked?: string | null;
  name: string;
  phoneNumber?: string | null;
  gender?: UserGender | null;
  address?: string | null;
  email?: string | null;
  age?: number | null;
  dateOfBirth?: string | null;
  shirtSize?: ShirtSize | null;
  customShirtSize?: string | null;
  allergies?: string | null;
  branchId?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IUpdateCurrentUserProfilePayload {
  email?: string | null;
  phoneNumber?: string;
  address?: string | null;
  shirtSize?: ShirtSize | null;
  customShirtSize?: string | null;
  allergies?: string | null;
}

export interface IUpdateUserPayload {
  name: string;
  dateOfBirth?: string | null;
  gender?: UserGender | null;
  shirtSize?: ShirtSize | null;
  customShirtSize?: string | null;
  allergies?: string | null;
  notes?: string | null;
  parentName?: string | null;
  phoneNumber: string;
  email?: string | null;
  address?: string | null;
}
