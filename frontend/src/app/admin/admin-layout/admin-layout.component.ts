import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: [
    './admin-layout.component.scss',
    '../../../../node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css',
    '../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css',
    '../../../../node_modules/@fortawesome/fontawesome-free/css/v4-shims.min.css',
    '../../../../node_modules/primeicons/primeicons.css',
    '../../../../node_modules/primeflex/primeflex.css',
    '../../../../node_modules/primeng/resources/primeng.min.css',
    '../../../../node_modules/primeng/resources/themes/nova/theme.css',
    '../primeng.scss',
    '../admin.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AdminLayoutComponent implements OnInit {

  toggleSidebar: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
