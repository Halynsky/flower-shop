import { Component } from "@angular/core";
import { ModalWindowService } from "../services/modal-window.service";

@Component({
  selector: 'layout',
  template: `
    <layout-header></layout-header>
    <modal-window *ngIf="modalPageService.getIsModal()"></modal-window>
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

  constructor( public modalPageService: ModalWindowService) {
  }

}
