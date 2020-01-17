import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from "primeng/api";
import { SecurityService } from "../../../services/security.service";

@Component({
  selector: 'admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  sidebar: boolean = true;
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();
  userActions: Array<MenuItem> = [
    {icon: 'fas fa-sign-out-alt', label: 'Вихід', command: () => this.logout()}
  ];

  constructor(public securityService: SecurityService) {
  }

  logout(): void {
    this.securityService.logout();
  }

  ngOnInit(): void {
  }

}
