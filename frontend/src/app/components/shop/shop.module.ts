import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared/shared.module";
import { ShopComponent } from "./shop.component";
import { SHOP_ROUTES } from "./shop.routing";

@NgModule({
  declarations: [
    ShopComponent
  ],
  imports: [
    SHOP_ROUTES,
    SharedModule
  ],
  bootstrap: [
    ShopComponent
  ]
})
export class ShopModule { }
