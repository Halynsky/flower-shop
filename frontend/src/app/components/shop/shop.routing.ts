import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ShopComponent } from "./shop.component";

const routes: Routes = [
  { path: '', component: ShopComponent},
];

export const SHOP_ROUTES: ModuleWithProviders = RouterModule.forChild(routes);
