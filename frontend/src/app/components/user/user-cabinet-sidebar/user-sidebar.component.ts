import {Component} from "@angular/core";
import {UserCabinetService} from "../../../services/user-cabinet.service";

@Component({
  selector: 'user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})

export class UserSidebarComponent {

  constructor(public userService: UserCabinetService){

  }

}
