import {Component} from "@angular/core";
import {UserCabinetService} from "../../../services/user-cabinet.service";
import { SecurityService } from "../../../services/security.service";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {

  constructor(public userService: UserCabinetService, public securityService: SecurityService){

  }

}
