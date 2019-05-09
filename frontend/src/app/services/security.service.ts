import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class SecurityService {

  public isLoggedIn: boolean = false;

  isAuthenticated() {
    return this.isLoggedIn = true;
  }

  login() {
    return this.isAuthenticated();
  }

  logout() {
    return this.isLoggedIn = false;
  }

  // hasRole(role: Role){
  //
  // }
}
