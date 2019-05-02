import { Component } from "@angular/core";

@Component({
  selector: 'layout',
  template: `
    <layout-header></layout-header>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: flex;
      width: 100%;
      flex-direction: column;
      /*justify-content: center;*/
      /*align-items: center;*/
    }
    router-outlet ::ng-deep + * {
      min-height: calc(100vh - 50px);
      position: absolute;
      top: 50px;
    }

    router-outlet ::ng-deep + * > .container {
      flex-grow: 1;
    }
  `]
})
export class LayoutComponent {

  constructor() {
  }

}
