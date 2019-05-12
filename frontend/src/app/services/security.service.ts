import { Injectable } from "@angular/core";
import { Role } from "../models/Role";

@Injectable({providedIn: 'root'})
export class SecurityService {

  private isLoggedIn: boolean = false;

  isAuthenticated() {
    return this.isLoggedIn;
  }

  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
  }

  hasRole(role: Role){
    return true;
  }
}
