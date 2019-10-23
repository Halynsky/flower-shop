import { Injectable } from "@angular/core";
import { Role } from "../models/Role";
import { User } from "../api/models/User";
import { USER_KEY } from "../utils/Costants";

@Injectable({providedIn: 'root'})
export class SecurityService {

  isAuthenticated() {
    return localStorage.getItem(USER_KEY) !== null;
  }

  login(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(USER_KEY);
  }

  hasRole(role: Role) {
    return this.getUser().role === role;
  }

  hasAnyRole(roles: Array<Role>) {
    let hasAnyRole = false;
    roles.forEach(role => {
      if (role === this.getUser().role) {
        hasAnyRole = true;
      }
    });
    return hasAnyRole;
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }
}
