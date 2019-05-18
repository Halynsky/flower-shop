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
        label: 'Магазин',
        icon: 'fas fa-shopping-cart',
        items: [
          {
            label: 'Замовлення',
            icon: 'fas fa-cart-arrow-down',
            routerLink: 'shop/orders'
          },
          {
            label: 'Склад',
            icon: 'fas fa-warehouse',
            routerLink: 'shop/warehouse'
          }
        ]
      },
      {
        label: 'Класифікатори',
        icon: 'pi pi-sitemap',
        items: [
          {
            label: 'Квіти',
            icon: 'fas fa-table',
            routerLink: 'types/flowers'
          },
          {
            label: 'Типи квітів',
            icon: 'fas fa-table',
            routerLink: 'types/flower-types'
          },
          {
            label: 'Розміри цибулин',
            icon: 'fas fa-table',
            routerLink: 'types/sizes'
          },
          {
            label: 'Кольори',
            icon: 'fas fa-table',
            routerLink: 'types/colors'
          }
        ]
      },
      {
        label: 'Блог',
        icon: 'far fa-newspaper',
        routerLink: 'blog'
      }
    ];
  }

}
