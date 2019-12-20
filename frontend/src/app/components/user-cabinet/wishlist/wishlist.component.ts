import {Component} from "@angular/core";
import { FavoritesService } from "../../../api/services/favorites.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { FlowerShort } from "../../../api/models/Flower";

@Component({
  selector: 'wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})

export class WishlistComponent {

  favoriteFlowers: FlowerShort[];

  constructor(public favoritesService: FavoritesService,
              private snackBarService: SnackBarService){
    this.getFavoriteFlowers()
  }

  getFavoriteFlowers() {
    this.favoritesService.getFavoriteFlowers().subscribe(
      favoriteFlowers => this.favoriteFlowers = favoriteFlowers,
        error => this.snackBarService.showError(getErrorMessage(error)))
  }

}
