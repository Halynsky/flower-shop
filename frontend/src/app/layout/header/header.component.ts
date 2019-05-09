import { Component } from '@angular/core';
import { SecurityService } from "../../services/security.service";

@Component({
  selector: 'layout-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class HeaderComponent {

  private isLoggedIn: boolean = false;

  constructor(public securityService: SecurityService) {

  }

  login() {
    this.isLoggedIn = this.securityService.login();
  }

  logout() {
    this.isLoggedIn = this.securityService.logout();

  }

}

