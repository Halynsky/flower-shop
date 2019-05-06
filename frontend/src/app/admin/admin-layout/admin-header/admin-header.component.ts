import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from "primeng/api";

@Component({
  selector: 'admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  sidebar: boolean = true;
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();
  userActions: Array<MenuItem> = [
    {icon: 'fas fa-pencil-alt', label: 'Account', routerLink: 'account'},
    {icon: 'fas fa-sign-out-alt', label: 'Logout', command: () => this.logout()}
  ];

  constructor() {
  }

  logout(): void {
    // this.securityService.logout();
  }

  ngOnInit(): void {
  }

}
