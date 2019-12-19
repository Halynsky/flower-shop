import {Component} from "@angular/core";
import { FavoritesService } from "../../../api/services/favorites.service";

@Component({
  selector: 'wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})

export class WishlistComponent {

  constructor(public favoritesService: FavoritesService){

  }

}
