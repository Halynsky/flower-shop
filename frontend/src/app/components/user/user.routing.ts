import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {ProfileComponent} from "./profile/profile.component";
import {WishlistComponent} from "./wishlist/wishlist.component";
import { FavouriteArticlesComponent } from "./favourite-articles/favourite-articles.component";
import { PurchaseHistoryComponent } from "./purchase-history/purchase-history.component";


const routes: Routes = [
  { path: 'profile', component: ProfileComponent},
  { path: 'wishlist', component: WishlistComponent},
  { path: 'purchases', component: PurchaseHistoryComponent},
  { path: 'favourite-articles', component: FavouriteArticlesComponent}

];

export const USER_ROUTES: ModuleWithProviders = RouterModule.forChild(routes);
