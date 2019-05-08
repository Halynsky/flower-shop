import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { routing } from "./admin.routing";
import { GrowlModule } from "primeng/growl";
import { DialogModule } from "primeng/dialog";
import { ButtonModule, ConfirmDialogModule, MenuModule, PanelMenuModule, TieredMenuModule } from "primeng/primeng";
import { AdminSidebarComponent } from './admin-layout/admin-sidebar/admin-sidebar.component';
import { UsersComponent } from './users/users.component';
import { AdminHeaderComponent } from './admin-layout/admin-header/admin-header.component';
import { WarehouseComponent } from './shop/warehouse/warehouse.component';
import { AdminAccordionComponent } from "./admin-layout/admin-sidebar/accordeon/admin-accordion.component";
import { BlogComponent } from './blog/blog.component';
import { OrdersComponent } from './shop/orders/orders.component';
import { FlowerTypesComponent } from './types/flower-types/flower-types.component';
import { TableModule } from "primeng/table";

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminSidebarComponent,
    AdminHeaderComponent,
    AdminAccordionComponent,
    UsersComponent,
    AdminHeaderComponent,
    WarehouseComponent,
    BlogComponent,
    OrdersComponent,
    FlowerTypesComponent
  ],
  imports: [
    routing,
    CommonModule,
    GrowlModule,
    DialogModule,
    ConfirmDialogModule,
    MenuModule,
    PanelMenuModule,
    ButtonModule,
    TieredMenuModule,
    TableModule
  ]
})
export class AdminModule { }
