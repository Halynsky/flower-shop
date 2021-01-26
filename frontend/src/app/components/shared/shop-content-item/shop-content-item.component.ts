import { Component, Input, OnInit } from '@angular/core';
import { SnackBarService } from "../../../services/snak-bar.service";
import { FavoritesService } from "../../../api/services/favorites.service";
import { getErrorMessage } from "../../../utils/Functions";
import { SecurityService } from "../../../services/security.service";
import { AddToBucketDialogComponent } from "../add-to-bucket-dialog/add-to-bucket-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FLOWER_IMAGE_PLACEHOLDER } from "../../../utils/Costants";
import { FlowerSize } from "../../../api/models/FlowerSize";


@Component({
  selector: 'shop-content-item',
  templateUrl: './shop-content-item.component.html',
  styleUrls: ['./shop-content-item.component.scss'],
  host: {'[id]': '"item_" + flowerSize.id'}
})
export class ShopContentItemComponent implements OnInit {

  @Input() public flowerSize: FlowerSize;
  @Input() public inFavorites: boolean = false;

  addToBucketDialogRef: MatDialogRef<AddToBucketDialogComponent>;
  flowerImagePlaceholder = FLOWER_IMAGE_PLACEHOLDER;

  constructor(private snackBar: SnackBarService,
              public favoritesService: FavoritesService,
              public dialog: MatDialog,
              public securityService: SecurityService) { }

  ngOnInit() {
  }

  addToFavorites(event) {
    event.stopPropagation();
    event.preventDefault();
    this.favoritesService.favoriteItemsIds.push(this.flowerSize.id);
    this.favoritesService.addFavoriteItem(this.flowerSize.id).subscribe(
      favoriteFlowersIds => {
        this.favoritesService.favoriteItemsIds = favoriteFlowersIds;
      },
      error => this.snackBar.showError(getErrorMessage(error)))
  }

  removeFromFavorites(event) {
    event.stopPropagation();
    event.preventDefault();
    this.favoritesService.favoriteItemsIds.splice(this.favoritesService.favoriteItemsIds.indexOf(this.flowerSize.id), 1);
    this.favoritesService.removeFavoriteItem(this.flowerSize.id).subscribe(
      favoriteFlowersIds => {
        this.favoritesService.favoriteItemsIds = favoriteFlowersIds;
      },
      error => this.snackBar.showError(getErrorMessage(error)))
  }

  openAddToCardModal(event) {
    event.stopPropagation();
    event.preventDefault();
    this.addToBucketDialogRef = this.dialog.open(AddToBucketDialogComponent, {maxWidth: 800, minWidth: 320, minHeight: 320});
    this.addToBucketDialogRef.componentInstance.id = this.flowerSize.id;
  }

}
