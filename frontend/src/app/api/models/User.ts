import { Role } from "../../models/Role";

export class User {
  id: any
  name: string;
  email: string;
  password: string;
  role: Role;
}

export class UserForAdmin extends User {
  isVirtual: boolean;
  isEnabled;
}
