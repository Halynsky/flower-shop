import { Component, Input, OnInit } from '@angular/core';
import { FlowerShort } from "../../../api/models/Flower";
import { SnackBarService } from "../../../services/snak-bar.service";
import { FavoritesService } from "../../../api/services/favorites.service";
import { getErrorMessage } from "../../../utils/Functions";
import { SecurityService } from "../../../services/security.service";
import { MatDialog, MatDialogRef } from "@angular/material";
import { AddToBucketDialogComponent } from "../add-to-bucket-dialog/add-to-bucket-dialog.component";

@Component({
  selector: 'shop-content-item',
  templateUrl: './shop-content-item.component.html',
  styleUrls: ['./shop-content-item.component.scss']
})
export class ShopContentItemComponent implements OnInit {

  @Input() public flower: FlowerShort;
  @Input() public inFavorites: boolean = false;

  addToBucketDialogRef: MatDialogRef<AddToBucketDialogComponent>;
  placeholderPhoto = '../../../../assets/img/common/flower-placeholder-bg.jpg';

  constructor(private snackBar: SnackBarService,
              private favoritesService: FavoritesService,
              public dialog: MatDialog,
              public securityService: SecurityService) { }

  ngOnInit() {
  }

  addToFavorites() {
    event.stopPropagation();
    this.favoritesService.favoriteFlowerIds.push(this.flower.id);
    this.favoritesService.addFavoriteFlower(this.flower.id).subscribe(
      favoriteFlowersIds => {
        this.favoritesService.favoriteFlowerIds = favoriteFlowersIds;
      },
      error => this.snackBar.showError(getErrorMessage(error)))
  }

  removeFromFavorites() {
    event.stopPropagation();
    this.favoritesService.favoriteFlowerIds.splice(this.favoritesService.favoriteFlowerIds.indexOf(this.flower.id), 1);
    this.favoritesService.removeFavoriteFlower(this.flower.id).subscribe(
      favoriteFlowersIds => {
        this.favoritesService.favoriteFlowerIds = favoriteFlowersIds;
      },
      error => this.snackBar.showError(getErrorMessage(error)))
  }

  openAddToCardModal(event) {
    event.stopPropagation();
    event.preventDefault();
    this.addToBucketDialogRef = this.dialog.open(AddToBucketDialogComponent, {maxWidth: 800, minWidth: 320, minHeight: 320});
    this.addToBucketDialogRef.componentInstance.id = this.flower.id;
  }

}
