import { Component } from "@angular/core";

@Component({
  selector: 'layout',
  template: `
    <layout-header></layout-header>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['layout.component.scss']
})
export class LayoutComponent {

  constructor() {
  }

}
