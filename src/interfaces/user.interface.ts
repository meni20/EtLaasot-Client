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
