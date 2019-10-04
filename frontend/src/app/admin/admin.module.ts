import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { routing } from "./admin.routing";
import { GrowlModule } from "primeng/growl";
import { DialogModule } from "primeng/dialog";
import {
  ButtonModule, CalendarModule, CheckboxModule, ColorPickerModule, ConfirmationService,
  ConfirmDialogModule, ContextMenuModule, DropdownModule, InputSwitchModule, InputTextModule, ListboxModule,
  MenuModule, MessageModule,
  MultiSelectModule,
  PanelMenuModule, RatingModule, SliderModule,
  TieredMenuModule, ToggleButtonModule
} from "primeng/primeng";
import { AdminSidebarComponent } from './admin-layout/admin-sidebar/admin-sidebar.component';
import { UsersComponent } from './users/users.component';
import { AdminHeaderComponent } from './admin-layout/admin-header/admin-header.component';
import { WarehouseOperationsComponent } from './shop/warehouse-operations/warehouse-operations.component';
import { AdminAccordionComponent } from "./admin-layout/admin-sidebar/accordeon/admin-accordion.component";
import { BlogComponent } from './blog/blog.component';
import { OrdersComponent } from './shop/orders/orders.component';
import { FlowerTypesComponent } from './types/flower-types/flower-types.component';
import { TableModule } from "primeng/table";
import { SizesComponent } from './types/sizes/sizes.component';
import { ColorsComponent } from './types/colors/colors.component';
import { NgArrayPipesModule } from "angular-pipes";
import { FlowersComponent } from "./types/flowers/flowers.component";
import { SizeItemComponent } from './types/sizes/size-item/size-item.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ColorItemComponent } from "./types/colors/color-item/color-item.component";
import { FlowerTypeItemComponent } from "./types/flower-types/flower-type-item/flower-type-item.component";
import { FlowerItemComponent } from "./types/flowers/flower-item/flower-item.component";
import { PipesModule } from "../pipes/pipes.module";
import { UniqueValidator } from "../validators/unique-validator.directive";
import { RangePairValidator } from "../validators/range-pair-validator.directive";


@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminSidebarComponent,
    AdminHeaderComponent,
    AdminAccordionComponent,
    UsersComponent,
    AdminHeaderComponent,
    WarehouseOperationsComponent,
    BlogComponent,
    OrdersComponent,
    FlowersComponent,
    FlowerItemComponent,
    FlowerTypesComponent,
    FlowerTypeItemComponent,
    SizesComponent,
    SizeItemComponent,
    ColorsComponent,
    ColorItemComponent,
    UniqueValidator,
    RangePairValidator
  ],
  imports: [
    routing,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgArrayPipesModule,
    GrowlModule,
    DialogModule,
    ConfirmDialogModule,
    MenuModule,
    PanelMenuModule,
    ButtonModule,
    TieredMenuModule,
    TableModule,
    MultiSelectModule,
    InputTextModule,
    ContextMenuModule,
    MessageModule,
    CalendarModule,
    SliderModule,
    NgArrayPipesModule,
    SliderModule,
    PipesModule.forRoot(),
    ColorPickerModule,
    SliderModule,
    DropdownModule,
    ToggleButtonModule,
    InputSwitchModule,
    RatingModule,
    ListboxModule,
    CheckboxModule,

  ],
  providers: [
    ConfirmationService
  ]
})
export class AdminModule { }
