import { NgModule } from '@angular/core';
import { UserCabinetComponent } from "./user-cabinet.component";
import { ProfileComponent } from "./profile/profile.component";
import { WishlistComponent } from "./wishlist/wishlist.component";
import { UserSidebarComponent } from "./user-cabinet-sidebar/user-sidebar.component";
import { FavouriteArticlesComponent } from "./favourite-articles/favourite-articles.component";
import { PurchaseHistoryComponent } from "./purchase-history/purchase-history.component";
import { RouterModule } from "@angular/router";
import { MatButtonModule, MatCardModule, MatExpansionModule, MatInputModule } from "@angular/material";
import { SharedModule } from "../shared/shared.module";
import { NgArrayPipesModule } from "angular-pipes";


@NgModule({
  declarations: [
    UserCabinetComponent,
    ProfileComponent,
    WishlistComponent,
    UserSidebarComponent,
    PurchaseHistoryComponent,
    FavouriteArticlesComponent
  ],
  imports: [
    RouterModule,
    SharedModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatExpansionModule,
    NgArrayPipesModule
  ],
  bootstrap: []
})
export class UserCabinetModule {
}
