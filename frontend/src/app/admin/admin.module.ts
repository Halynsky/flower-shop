import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { routing } from "./admin.routing";
import { DialogModule } from "primeng/dialog";
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
import { UserItemComponent } from "./users/user-item/user-item.component";
import { WarehouseOperationItemComponent } from "./shop/warehouse-operations/warehouse-operation-item/warehouse-operation-item.component";
import { ValidatorsModule } from "../validators/validators.module";
import { ImagePreviewComponent } from "./shared/image-preview/image-preview.component";
import { WarehouseComponent } from "./shop/warehouse/warehouse.component";
import {
  ButtonModule,
  CalendarModule,
  CardModule,
  ChartModule,
  CheckboxModule,
  ColorPickerModule,
  ConfirmationService,
  ConfirmDialogModule,
  ContextMenuModule,
  DialogService,
  DropdownModule,
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
  EditorModule,
  InputSwitchModule,
  InputTextareaModule,
  InputTextModule,
  KeyFilterModule,
  ListboxModule,
  MenuModule,
  MessageModule,
  MultiSelectModule,
  PanelMenuModule,
  ProgressSpinnerModule,
  RatingModule,
  SliderModule,
  TieredMenuModule,
  ToggleButtonModule
} from "primeng";
import { DirectivesModule } from "../directives/directives.module";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { GroupItemComponent } from "./types/groups/group-item/group-item.component";
import { GroupsComponent } from "./types/groups/groups.component";
import { StatisticComponent } from "./statistic/statistic.component";
import { EditorDialogComponent } from './shared/editor-dialog/editor-dialog.component';

export const ngxMaskOptions: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminSidebarComponent,
    AdminHeaderComponent,
    AdminAccordionComponent,
    ImagePreviewComponent,
    UsersComponent,
    UserItemComponent,
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
    GroupsComponent,
    GroupItemComponent,
    WarehouseOperationItemComponent,
    WarehouseComponent,
    UserItemComponent,
    StatisticComponent,
    EditorDialogComponent
  ],
  imports: [
    routing,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgArrayPipesModule,
    DialogModule,
    ConfirmDialogModule,
    MenuModule,
    PanelMenuModule,
    ButtonModule,
    TieredMenuModule,
    TableModule,
    MultiSelectModule,
    InputTextModule,
    InputTextareaModule,
    ContextMenuModule,
    MessageModule,
    CalendarModule,
    SliderModule,
    NgArrayPipesModule,
    SliderModule,
    EditorModule,
    DynamicDialogModule,
    PipesModule.forRoot(),
    DirectivesModule.forRoot(),
    ValidatorsModule.forRoot(),
    ColorPickerModule,
    SliderModule,
    DropdownModule,
    ToggleButtonModule,
    InputSwitchModule,
    RatingModule,
    ListboxModule,
    CheckboxModule,
    CardModule,
    NgxMaskModule.forRoot(ngxMaskOptions),
    KeyFilterModule,
    ChartModule,
    ProgressSpinnerModule
  ],
  providers: [
    ConfirmationService,
    DialogService,
    DynamicDialogRef,
    DynamicDialogConfig
  ],
  entryComponents: [
    EditorDialogComponent,

  ]
})
export class AdminModule {
}
