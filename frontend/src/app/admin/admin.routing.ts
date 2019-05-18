import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from "./admin-layout/admin-layout.component";
import { UsersComponent } from "./users/users.component";
import { WarehouseComponent } from "./shop/warehouse/warehouse.component";
import { BlogComponent } from "./blog/blog.component";
import { OrdersComponent } from "./shop/orders/orders.component";
import { FlowerTypesComponent } from "./types/flower-types/flower-types.component";
import { SizesComponent } from "./types/sizes/sizes.component";
import { ColorsComponent } from "./types/colors/colors.component";
import { FlowersComponent } from "./types/flowers/flowers.component";
import { SizeItemComponent } from "./types/sizes/size-item/size-item.component";


const routes: Routes = [
  { path: '',
    component: AdminLayoutComponent,
    children: [
      {path: '', redirectTo: 'users', pathMatch: 'full'},
      {path: 'users', component: UsersComponent},
      {path: 'shop/orders', component: OrdersComponent},
      {path: 'shop/warehouse', component: WarehouseComponent},
      {path: 'types/flower-types', component: FlowerTypesComponent},
      {path: 'types/flowers', component: FlowersComponent},
      {path: 'types/sizes', component: SizesComponent},
      {path: 'types/sizes/item', component: SizeItemComponent},
      {path: 'types/colors', component: ColorsComponent},
      {path: 'blog', component: BlogComponent}
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);


