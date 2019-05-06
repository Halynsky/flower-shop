import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { MenuItem } from "primeng/api";

@Component({
  selector: 'admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {

  @Input()
  @HostBinding('class.-opened')
  toggleSidebar: boolean;


  items: MenuItem[];

  constructor() {
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Користувачі',
        icon: 'pi pi-fw pi-user',
        routerLink: 'users'
      },
      {
        label: 'Склад',
        icon: 'fas fa-warehouse',
        routerLink: 'warehouse'
      }
    ];
  }

}
