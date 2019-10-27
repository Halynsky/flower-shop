import { Component, OnInit } from "@angular/core";
import { UserCabinetService } from "../../../services/user-cabinet.service";
import { Router } from "@angular/router";

@Component({
  selector: 'user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})

export class UserSidebarComponent implements OnInit {


  constructor(public userService: UserCabinetService, private router: Router) {

  }

  ngOnInit(): void {
    this.onButtonGroupClick();
  }

  onButtonGroupClick() {
    let currentUrl = this.router.url;
    currentUrl = currentUrl.split('/').pop();
    this.userService.changeButtonColor(currentUrl);
  }


}
