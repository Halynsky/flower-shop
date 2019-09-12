import { NgModule } from '@angular/core';
import { UserComponent } from "./user.component";

import { ProfileComponent } from "./profile/profile.component";
import { WishlistComponent } from "./wishlist/wishlist.component";
import { UserSidebarComponent } from "./user-cabinet-sidebar/user-sidebar.component";
import { FavouriteArticlesComponent } from "./favourite-articles/favourite-articles.component";
import { PurchaseHistoryComponent } from "./purchase-history/purchase-history.component";
import { RouterModule } from "@angular/router";


@NgModule({
  declarations: [
    UserComponent,
    ProfileComponent,
    WishlistComponent,
    UserSidebarComponent,
    PurchaseHistoryComponent,
    FavouriteArticlesComponent
  ],
  imports: [
    RouterModule
  ],
  bootstrap: []
})
export class UserModule {
}
