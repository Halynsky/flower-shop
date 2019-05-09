import { Component } from '@angular/core';
import { SecurityService } from "../../services/security.service";

@Component({
  selector: 'layout-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class HeaderComponent {

  private isLogined: boolean = false;

  constructor(public securityService: SecurityService) {

  }

  login() {
    this.isLogined = this.securityService.login();
    console.log(this.isLogined);
  }

}

