import { EventEmitter, Injectable } from "@angular/core";
import { Role } from "../models/Role";

import { Router } from "@angular/router";

import { SecurityUserModel } from "../api/models/User";
import { USER_KEY } from "../utils/Costants";
import { ReplaySubject } from "rxjs";
import { AuthDialogComponent } from "../components/shared/auth-dialog/auth-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { AddEmailDialogComponent } from "../components/shared/add-email-dialog/add-email-dialog.component";


@Injectable({providedIn: 'root'})
export class SecurityService {

  public onLogin: ReplaySubject<any> = new ReplaySubject(1);
  public onLogout: EventEmitter<any> = new EventEmitter();

  constructor(public router: Router,
              public dialog: MatDialog) {
    this.onLogin.subscribe(() => {
      if (this.hasAnyRole([Role.ADMIN, Role.SUPPORT])) {
        this.router.navigate(['admin', 'shop', 'orders']);
      }
    })
  }


  isAuthenticated() {
    return localStorage.getItem(USER_KEY) !== null;
  }

  updateUser(user: SecurityUserModel) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  login(user: SecurityUserModel) {
    this.updateUser(user);
    this.onLogin.next(user);
  }

  logout() {
    this.router.navigate(['']);
    localStorage.removeItem(USER_KEY);
    this.onLogout.emit();
  }

  hasRole(role: Role) {
    return this.getUser() && this.getUser().role === role;
  }

  hasAnyRole(roles: Array<Role>) {
    return roles.includes(this.getUser().role);
  }

  getUser(): SecurityUserModel {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  openAuthDialog(email?: string) {
    let authDialogRef = this.dialog.open(AuthDialogComponent);
    if (email) {
      authDialogRef.componentInstance.credentials.email = email;
    }
  }

  openEmailPhoneDialog(user) {
    let addPhoneEmailDialogRef = this.dialog.open(AddEmailDialogComponent, {panelClass: 'modal-no-padding-dialog'});
    addPhoneEmailDialogRef.componentInstance.user = user;
  }

}
