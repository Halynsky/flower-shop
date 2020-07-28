import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from "./shop.component";
import { ShopItemPageComponent } from "./shop-item-page/shop-item-page.component";

const routes: Routes = [
  { path: '', component: ShopComponent},
  { path: 'item/:id', component: ShopItemPageComponent}
];

export const SHOP_ROUTES = RouterModule.forChild(routes);
