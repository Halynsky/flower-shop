import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTooltipModule,
  MatTreeModule
} from "@angular/material";
import { ArticleCardComponent } from './article-card/article-card.component';
import { RouterModule } from "@angular/router";
import { BottomSheetOverview } from "./bottom-sheet/bottom-sheet.component";
import { PipesModule } from "../../../pipes/pipes.module";
import { MessageModule } from "primeng/message";
import { AuthDialogComponent } from "./auth-dialog/auth-dialog.component";
import { BucketDialogComponent } from "./bucket-dialog/bucket-dialog.component";
import { ValidatorModule } from "../../../validators/validator.module";
import { ShopContentItemComponent } from "./shop-content-item/shop-content-item.component";
import { ShopFiltersComponent } from "./shop-filters/shop-filters.component";
import { ShopFilterDialogComponent } from "./shop-filter-dialog/shop-filter-dialog.component";
import { DigitOnlyDirective } from "../../../directives/ditgits-only.directive";
import { AmountControlledInputComponent } from './amount-controled-input/amount-controlled-input.component';

const PROVIDERS = [
  {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 4000, panelClass: "snack-custom-class"}},
  {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {hasBackdrop: true, backdropClass: "bottom-sheet-custom-class", closeOnNavigation: true}},
];

@NgModule({
  declarations: [
    ArticleCardComponent,
    BottomSheetOverview,
    AuthDialogComponent,
    BucketDialogComponent,
    ShopContentItemComponent,
    ShopFiltersComponent,
    ShopFilterDialogComponent,
    DigitOnlyDirective,
    AmountControlledInputComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatListModule,
    MatBottomSheetModule,
    MatStepperModule,
    MatTreeModule,
    PipesModule,
    MatDialogModule,
    MessageModule,
    ValidatorModule.forRoot()
  ],
  exports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatTooltipModule,
    MatStepperModule,
    MatTreeModule,
    PipesModule,
    ValidatorModule,
    // Developed Components
    ArticleCardComponent,
    ShopContentItemComponent,
    ShopFiltersComponent,
    ShopFilterDialogComponent,
    AmountControlledInputComponent,
    // Developed Directives
    DigitOnlyDirective
  ],
  providers: [
    ...PROVIDERS
  ],
  entryComponents: [
    BottomSheetOverview
  ],
  bootstrap: [
    BottomSheetOverview
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [...PROVIDERS]
    };
  }
}
