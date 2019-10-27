import {Component} from "@angular/core";
import {UserCabinetService} from "../../../services/user-cabinet.service";

@Component({
  selector: 'purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss']
})

export class PurchaseHistoryComponent {

  constructor(public userService: UserCabinetService){

  }

}
