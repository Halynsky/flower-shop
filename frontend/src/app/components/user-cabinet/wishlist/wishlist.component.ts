import { Component, OnDestroy } from "@angular/core";
import { FavoritesService } from "../../../api/services/favorites.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FlowerSize } from "../../../api/models/FlowerSize";

@Component({
  selector: 'wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})

export class WishlistComponent implements OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  favoriteItems: FlowerSize[];

  constructor(public favoritesService: FavoritesService,
              private snackBarService: SnackBarService){
    this.getFavoriteFlowers()
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getFavoriteFlowers() {
    this.favoritesService.getFavoriteItems()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        favoriteItems => this.favoriteItems = favoriteItems,
        error => this.snackBarService.showError(getErrorMessage(error)))
  }

}
