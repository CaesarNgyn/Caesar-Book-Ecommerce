import { Role } from "./roles/roles.enum";

export interface IUser {

  _id: string;
  fullName: string;
  email: string;
  role: Role;
  phone: string;
  avatar: string;


}