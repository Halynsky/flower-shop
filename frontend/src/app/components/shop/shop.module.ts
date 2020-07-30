import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { ShopComponent } from "./shop.component";
import { SHOP_ROUTES } from "./shop.routing";
import { ShopItemPageComponent } from "./shop-item-page/shop-item-page.component";
import { PurchaseAdditionalInfoComponent } from './shop-item-page/purchase-additional-info/purchase-additional-info.component';
import { SpecificationsComponent } from './shop-item-page/specifications/specifications.component';

@NgModule({
  declarations: [
    ShopComponent,
    ShopItemPageComponent,
    PurchaseAdditionalInfoComponent,
    SpecificationsComponent
  ],
  imports: [
    SHOP_ROUTES,
    SharedModule.forRoot()
  ],
  bootstrap: [
    ShopComponent
  ]
})
export class ShopModule { }
