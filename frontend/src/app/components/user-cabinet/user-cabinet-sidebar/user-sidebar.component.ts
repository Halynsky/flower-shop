import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})

export class UserSidebarComponent {

  constructor(private router: Router) {
  }

}
