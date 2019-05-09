import { Component } from '@angular/core';
import { SecurityService } from "../../services/security.service";

@Component({
  selector: 'layout-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class HeaderComponent {

  constructor(public securityService: SecurityService) {

  }



}

