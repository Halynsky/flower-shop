import { Role } from "../../models/Role";

export class User {
  id: any;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
}

export class UserForAdmin extends User {
  isVirtual: boolean = true;
  isEnabled: boolean = true;
  isActivated: boolean = true;
}

export class UserRegistration {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
}
