import { EventEmitter, Injectable } from "@angular/core";
import { Role } from "../models/Role";

import { Router } from "@angular/router";

import { User } from "../api/models/User";
import { USER_KEY } from "../utils/Costants";
import { AuthService as SocialAuthService } from "angularx-social-login";
import { ReplaySubject } from "rxjs";


@Injectable({providedIn: 'root'})
export class SecurityService {

  public onLogin: ReplaySubject<any> = new ReplaySubject(1);
  public onLogout: EventEmitter<any> = new EventEmitter();

  constructor(public router: Router,
              public socialAuthService: SocialAuthService) {
    this.onLogin.subscribe(() => {
      if (this.hasAnyRole([Role.ADMIN, Role.SUPPORT])) {
        this.router.navigate(['admin', 'shop', 'orders']);
      }
    })
  }


  isAuthenticated() {
    return localStorage.getItem(USER_KEY) !== null;
  }

  login(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.onLogin.next();
  }

  logout() {
    this.router.navigate(['']);
    localStorage.removeItem(USER_KEY);
    this.socialAuthService.authState.subscribe(state => {
      if(state) {
        this.socialAuthService.signOut();
      }
    });
    this.onLogout.emit();
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
