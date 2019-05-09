import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared/shared.module";
import { ShopComponent } from "./shop.component";
import { SHOP_ROUTES } from "./shop.routing";
import { ShopFiltersComponent } from './shop-filters/shop-filters.component';
import { MatTreeModule } from "@angular/material";

@NgModule({
  declarations: [
    ShopComponent,
    ShopFiltersComponent
  ],
  imports: [
    SHOP_ROUTES,
    SharedModule,
    MatTreeModule
  ],
  bootstrap: [
    ShopComponent
  ]
})
export class ShopModule { }
