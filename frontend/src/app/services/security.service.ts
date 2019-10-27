import { Injectable } from "@angular/core";
import { Role } from "../models/Role";

import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";

import { User } from "../api/models/User";
import { USER_KEY } from "../utils/Costants";


@Injectable({providedIn: 'root'})
export class SecurityService implements CanActivate{


  private isLoggedIn: boolean = false;

  constructor(public router: Router){}


  isAuthenticated() {
    return localStorage.getItem(USER_KEY) !== null;
  }

  login(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  logout() {

    this.router.navigate(['']);
    localStorage.removeItem(USER_KEY);
  }

  hasRole(role: Role) {
    return this.getUser().role === role;
  }

  hasAnyRole(roles: Array<Role>) {
    return roles.includes(this.getUser().role);;
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }
    return true;

  }
}
