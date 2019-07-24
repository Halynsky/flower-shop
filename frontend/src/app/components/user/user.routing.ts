import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {ProfileComponent} from "./profile/profile.component";
import {WishlistComponent} from "./wishlist/wishlist.component";


const routes: Routes = [
  { path: 'profile', component: ProfileComponent},
  { path: 'wishlist', component: WishlistComponent}
];

export const USER_ROUTES: ModuleWithProviders = RouterModule.forChild(routes);
