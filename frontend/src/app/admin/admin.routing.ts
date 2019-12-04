import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from "./admin-layout/admin-layout.component";
import { UsersComponent } from "./users/users.component";
import { WarehouseOperationsComponent } from "./shop/warehouse-operations/warehouse-operations.component";
import { BlogComponent } from "./blog/blog.component";
import { OrdersComponent } from "./shop/orders/orders.component";
import { FlowerTypesComponent } from "./types/flower-types/flower-types.component";
import { SizesComponent } from "./types/sizes/sizes.component";
import { ColorsComponent } from "./types/colors/colors.component";
import { FlowersComponent } from "./types/flowers/flowers.component";
import { SizeItemComponent } from "./types/sizes/size-item/size-item.component";
import { ColorItemComponent } from "./types/colors/color-item/color-item.component";
import { FlowerTypeItemComponent } from "./types/flower-types/flower-type-item/flower-type-item.component";
import { FlowerItemComponent } from "./types/flowers/flower-item/flower-item.component";
import { UserItemComponent } from "./users/user-item/user-item.component";


const routes: Routes = [
  { path: '',
    component: AdminLayoutComponent,
    children: [
      {path: '', redirectTo: 'users', pathMatch: 'full'},
      {path: 'users', component: UsersComponent},
      {path: 'users/item/:mode', component: UserItemComponent},
      {path: 'shop/orders', component: OrdersComponent},
      {path: 'shop/warehouse-operations', component: WarehouseOperationsComponent},
      {path: 'types/flower-types', component: FlowerTypesComponent},
      {path: 'types/flower-types/item/:mode', component: FlowerTypeItemComponent},
      {path: 'types/flowers', component: FlowersComponent},
      {path: 'types/flowers/item/:mode', component: FlowerItemComponent},
      {path: 'types/sizes', component: SizesComponent},
      {path: 'types/sizes/item/:mode', component: SizeItemComponent},
      {path: 'types/colors', component: ColorsComponent},
      {path: 'types/colors/item/:mode', component: ColorItemComponent},
      {path: 'blog', component: BlogComponent}
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);


