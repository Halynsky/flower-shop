import { Role } from "../../models/Role";

export class User {
  name: string;
  email: string;
  password: string;
  isVirtual: boolean;
  isEnabled;
  role: Role;
  orders: [];
}
