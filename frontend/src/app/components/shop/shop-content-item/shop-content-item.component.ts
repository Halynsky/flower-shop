import { Component, Input, OnInit } from '@angular/core';
import { FlowerShort } from "../../../api/models/Flower";
import { SnackBarService } from "../../../services/snak-bar.service";
import { FavoritesService } from "../../../api/services/favorites.service";
import { getErrorMessage } from "../../../utils/Functions";

@Component({
  selector: 'shop-content-item',
  templateUrl: './shop-content-item.component.html',
  styleUrls: ['./shop-content-item.component.scss']
})
export class ShopContentItemComponent implements OnInit {

  @Input()
  public flower: FlowerShort;

  constructor(private snackBar: SnackBarService,
              private favoritesService: FavoritesService) { }

  ngOnInit() {
  }

  addToFavorites() {
    event.stopPropagation();
    this.favoritesService.addFavoriteFlower(this.flower.id).subscribe(
      favoriteFlowersIds => {
        this.favoritesService.favoriteFlowerIds = favoriteFlowersIds;
        this.snackBar.showSuccess(`${this.flower.flowerType.nameSingle} ${this.flower.name} успішно додано до вашого списку бажаннь`)
      },
      error => this.snackBar.showError(getErrorMessage(error)))
  }

  removeFromFavorites() {
    event.stopPropagation();
    this.favoritesService.removeFavoriteFlower(this.flower.id).subscribe(
      favoriteFlowersIds => {
        this.favoritesService.favoriteFlowerIds = favoriteFlowersIds;
      },
      error => this.snackBar.showError(getErrorMessage(error)))
  }

  addToCard(event) {
    event.stopPropagation();
    this.snackBar.methodNotImplemented();
  }

}
