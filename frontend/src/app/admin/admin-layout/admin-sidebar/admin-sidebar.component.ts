import { Component, OnInit } from '@angular/core';
import { MenuItem } from "primeng/api";

@Component({
  selector: 'admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {

  items: MenuItem[];

  constructor() {
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Користувачі',
        icon: 'pi pi-fw pi-user',
        routerLink: 'users',
        routerLinkActiveOptions: {exact:true}
      },
      {
        label: 'Склад',
        icon: 'fas fa-warehouse',
        routerLink: 'warehouse'
      }
    ];
  }

}
