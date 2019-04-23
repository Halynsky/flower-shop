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
      justify-content: center;
      align-items: center;
    }
    router-outlet ::ng-deep + * {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 50px);
      position: absolute;
      top: 50px;
      width: 100%;
      max-width: 1200px;
      padding: 0 2em;
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
