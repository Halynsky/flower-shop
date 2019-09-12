import {Component} from "@angular/core";

@Component({
  selector: 'user',
  template: `
    <user-sidebar></user-sidebar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: flex;
      padding-top: 24px;
    }
  `]
})

export class UserComponent {

}
