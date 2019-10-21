import { Injectable } from "@angular/core";
import { Role } from "../models/Role";
import { User } from "../api/models/User";
import { USER_KEY } from "../utils/Costants";

@Injectable({providedIn: 'root'})
export class SecurityService {

  // private isLoggedIn: boolean = false;

  isAuthenticated() {
    return localStorage.getItem(USER_KEY) !== null;
  }

  login(user: User) {
    // this.isLoggedIn = true;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  logout() {
    // this.isLoggedIn = false;
    localStorage.removeItem(USER_KEY);
  }

  hasRole(role: Role){
    return true;
  }

  getUser() {
      return JSON.parse(localStorage.getItem(USER_KEY));
  }
}
