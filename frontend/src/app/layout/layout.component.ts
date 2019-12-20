import { Component } from "@angular/core";
import { ModalWindowService } from "../services/modal-window.service";

@Component({
  selector: 'layout',
  template: `
    <layout-header></layout-header>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['layout.component.scss']
})
export class LayoutComponent {

  constructor(public modalPageService: ModalWindowService) {
  }

}
