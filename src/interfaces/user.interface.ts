import type { IEvent } from "./event.interface";

export interface IUser {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  age: number;
  userRoles: IUserRole[];
  events?: IEvent[];

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface IUserRole {
  roleId: number;
}
