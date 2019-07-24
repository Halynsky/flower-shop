import { Injectable } from "@angular/core";
import { Role } from "../models/Role";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class SecurityService implements CanActivate{

  private isLoggedIn: boolean = false;

  constructor(public router: Router){}

  isAuthenticated() {
    return this.isLoggedIn;
  }

  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
    this.router.navigate(['']);
  }

  hasRole(role: Role){
    return true;
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }
    return true;

  }
}
