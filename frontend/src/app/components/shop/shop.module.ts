import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared/shared.module";
import { ShopComponent } from "./shop.component";
import { SHOP_ROUTES } from "./shop.routing";
import { ShopFiltersComponent } from './shop-filters/shop-filters.component';
import { MatTreeModule } from "@angular/material";
import { ShopContentItemComponent } from './shop-content-item/shop-content-item.component';
import { ShopItemPageComponent } from "./shop-item-page/shop-item-page.component";

@NgModule({
  declarations: [
    ShopComponent,
    ShopFiltersComponent,
    ShopContentItemComponent,
    ShopItemPageComponent
  ],
  imports: [
    SHOP_ROUTES,
    SharedModule.forRoot(),
    MatTreeModule
  ],
  bootstrap: [
    ShopComponent
  ]
})
export class ShopModule { }
