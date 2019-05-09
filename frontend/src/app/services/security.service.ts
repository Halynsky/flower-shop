import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class SecurityService {

  private isLogined: boolean = false;

  isAuthenticated() {
    return this.isLogined = true;
  }

  login() {
    return this.isAuthenticated();
  }

  // hasRole(role: Role){
  //
  // }
}
