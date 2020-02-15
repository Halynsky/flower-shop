import { Component, OnDestroy } from "@angular/core";
import { FavoritesService } from "../../../api/services/favorites.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { FlowerShort } from "../../../api/models/Flower";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})

export class WishlistComponent implements OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  favoriteFlowers: FlowerShort[];

  constructor(public favoritesService: FavoritesService,
              private snackBarService: SnackBarService){
    this.getFavoriteFlowers()
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getFavoriteFlowers() {
    this.favoritesService.getFavoriteFlowers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
      favoriteFlowers => this.favoriteFlowers = favoriteFlowers,
        error => this.snackBarService.showError(getErrorMessage(error)))
  }

}
