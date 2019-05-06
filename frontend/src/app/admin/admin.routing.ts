import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from "./admin-layout/admin-layout.component";
import { UsersComponent } from "./users/users.component";
import { WarehouseComponent } from "./warehouse/warehouse.component";


const routes: Routes = [
  { path: '',
    component: AdminLayoutComponent,
    children: [
      {path: '', redirectTo: 'users', pathMatch: 'full'},
      {path: 'users', component: UsersComponent},
      {path: 'warehouse', component: WarehouseComponent}
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);


