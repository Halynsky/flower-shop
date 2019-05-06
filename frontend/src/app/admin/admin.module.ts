import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { routing } from "./admin.routing";
import { GrowlModule } from "primeng/growl";
import { DialogModule } from "primeng/dialog";
import { ButtonModule, ConfirmDialogModule, MenuModule, PanelMenuModule } from "primeng/primeng";
import { AdminSidebarComponent } from './admin-layout/admin-sidebar/admin-sidebar.component';
import { UsersComponent } from './users/users.component';
import { AdminHeaderComponent } from './admin-layout/admin-header/admin-header.component';
import { WarehouseComponent } from './warehouse/warehouse.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminSidebarComponent,
    UsersComponent,
    AdminHeaderComponent,
    WarehouseComponent
  ],
  imports: [
    routing,
    CommonModule,
    GrowlModule,
    DialogModule,
    ConfirmDialogModule,
    MenuModule,
    PanelMenuModule,
    ButtonModule
  ]
})
export class AdminModule { }
