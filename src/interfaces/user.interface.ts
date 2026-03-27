import type { IEvent } from "./event.interface";

export interface IUserFormData {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  age: number;
}

export interface IUser extends IUserFormData {
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
