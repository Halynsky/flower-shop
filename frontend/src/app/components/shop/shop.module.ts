import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared/shared.module";
import { ShopComponent } from "./shop.component";
import { SHOP_ROUTES } from "./shop.routing";
import { ShopFiltersComponent } from './shop-filters/shop-filters.component';
import { MatTreeModule } from "@angular/material";
import { FilterTreeComponent } from './shop-filters/filter-tree/filter-tree.component';
import { FilterTreeNodeComponent } from './shop-filters/filter-tree/filter-tree-node/filter-tree-node.component';

@NgModule({
  declarations: [
    ShopComponent,
    ShopFiltersComponent,
    FilterTreeComponent,
    FilterTreeNodeComponent
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
