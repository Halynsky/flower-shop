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
  created: string;
  lastOrderDate: string;
  note: string;
}

export class UserShortForAdmin extends User {
  id: any;
  name: string;
  email: string;
  phone: string;
}

export class UserRegistration {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
}

export class SecurityUserModel {
  id: any;
  name: string;
  email: string;
  role: Role;
  phone: string;

  constructor(id: any, name: string, email: string, role: Role, phone: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.phone = phone;
  }

}
