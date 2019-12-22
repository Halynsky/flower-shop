import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared/shared.module";
import { ShopComponent } from "./shop.component";
import { SHOP_ROUTES } from "./shop.routing";
import { MatTreeModule } from "@angular/material";
import { ShopItemPageComponent } from "./shop-item-page/shop-item-page.component";

@NgModule({
  declarations: [
    ShopComponent,
    ShopItemPageComponent
  ],
  imports: [
    SHOP_ROUTES,
    SharedModule.forRoot(),
    MatTreeModule,
    SharedModule
  ],
  bootstrap: [
    ShopComponent
  ]
})
export class ShopModule { }
