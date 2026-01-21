export interface IUser {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  age: number;
    userRole: IUserRole[];


  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface IUserRole {
  roleId: number;

}

