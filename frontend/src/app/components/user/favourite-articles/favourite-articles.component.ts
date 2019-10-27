import {Component} from "@angular/core";
import {UserCabinetService} from "../../../services/user-cabinet.service";

@Component({
  selector: 'favourite-articles',
  templateUrl: './favourite-articles.component.html',
  styleUrls: ['./favourite-articles.component.scss']
})

export class FavouriteArticlesComponent {

  constructor(public userService: UserCabinetService){

  }

}
