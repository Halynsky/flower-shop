import { Injectable } from "@angular/core";
import { Role } from "../models/Role";

import { Router } from "@angular/router";

import { User } from "../api/models/User";
import { USER_KEY } from "../utils/Costants";
import { AuthService as SocialAuthService } from "angularx-social-login";


@Injectable({providedIn: 'root'})
export class SecurityService {

  private isLoggedIn: boolean = false;

  constructor(public router: Router,
              public socialAuthService: SocialAuthService){
  }


  isAuthenticated() {
    return localStorage.getItem(USER_KEY) !== null;
  }

  login(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  logout() {
    this.router.navigate(['']);
    localStorage.removeItem(USER_KEY);
    this.socialAuthService.authState.subscribe(state => {
      if(state) {
        this.socialAuthService.signOut();
      }
    });
  }

  hasRole(role: Role) {
    return this.getUser() && this.getUser().role === role;
  }

  hasAnyRole(roles: Array<Role>) {
    return roles.includes(this.getUser().role);
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

}
