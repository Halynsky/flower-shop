import { NgModule } from '@angular/core';
import { UserCabinetComponent } from "./user-cabinet.component";
import { ProfileComponent } from "./profile/profile.component";
import { WishlistComponent } from "./wishlist/wishlist.component";
import { UserSidebarComponent } from "./user-cabinet-sidebar/user-sidebar.component";
import { FavouriteArticlesComponent } from "./favourite-articles/favourite-articles.component";
import { PurchaseHistoryComponent } from "./purchase-history/purchase-history.component";
import { RouterModule } from "@angular/router";
import { InputTextModule } from "primeng/primeng";
import { MatButtonModule, MatCardModule } from "@angular/material";
import { MatInputModule } from "@angular/material";
import { SharedModule } from "../shared/shared/shared.module";
import { ValidatorModule } from "../../validators/validator.module";
import { NgArrayPipesModule } from "angular-pipes";
import { ShopContentItemComponent } from "../shared/shared/shop-content-item/shop-content-item.component";


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
    InputTextModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    NgArrayPipesModule
  ],
  bootstrap: []
})
export class UserCabinetModule {
}
