import {Component} from "@angular/core";
import {UserCabinetService} from "../../../services/user-cabinet.service";

@Component({
  selector: 'wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})

export class WishlistComponent {

  constructor(public userService: UserCabinetService){

  }

}
