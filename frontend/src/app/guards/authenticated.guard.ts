import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, CanLoad, Router } from "@angular/router";
import { SecurityService } from "../services/security.service";

@Injectable({providedIn: 'root'})
export class AuthenticatedGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private securityService: SecurityService, private router: Router) {
  }

  canActivate(): boolean {
    return this.hasAccess();
  }

  canActivateChild(): boolean {
    return this.hasAccess();
  }

  canLoad(): boolean {
    return this.hasAccess();
  }

  private hasAccess(): boolean {
    if (this.securityService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate([ '/403' ]);
      return false;
    }
  }
}
