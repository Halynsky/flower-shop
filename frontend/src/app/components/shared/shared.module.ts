import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ArticleCardComponent } from './article-card/article-card.component';
import { RouterModule } from "@angular/router";
import { PipesModule } from "../../pipes/pipes.module";
import { MessageModule } from "primeng/message";
import { AuthDialogComponent } from "./auth-dialog/auth-dialog.component";
import { BucketDialogComponent } from "./bucket-dialog/bucket-dialog.component";
import { ValidatorsModule } from "../../validators/validators.module";
import { ShopContentItemComponent } from "./shop-content-item/shop-content-item.component";
import { ShopFiltersComponent } from "./shop-filters/shop-filters.component";
import { ShopFilterDialogComponent } from "./shop-filter-dialog/shop-filter-dialog.component";
import { AmountControlledInputComponent } from './amount-controled-input/amount-controlled-input.component';
import { AddToBucketDialogComponent } from "./add-to-bucket-dialog/add-to-bucket-dialog.component";
import { DirectivesModule } from "../../directives/directives.module";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { HowToPayDialogComponent } from "./how-to-pay-dialog/how-to-pay-dialog.component";
import { HowToPayComponent } from "./how-to-pay/how-to-pay.component";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from "@angular/material/snack-bar";
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSelectModule } from "@angular/material/select";
import { MatListModule } from "@angular/material/list";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTreeModule } from "@angular/material/tree";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";


const PROVIDERS = [
  {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 4000, panelClass: "snack-custom-class"}},
  {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {hasBackdrop: true, backdropClass: "bottom-sheet-custom-class", closeOnNavigation: true}}
];

export const ngxMaskOptions: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    ArticleCardComponent,
    AuthDialogComponent,
    BucketDialogComponent,
    AddToBucketDialogComponent,
    HowToPayDialogComponent,
    ShopContentItemComponent,
    ShopFiltersComponent,
    ShopFilterDialogComponent,
    AmountControlledInputComponent,
    TermsAndConditionsComponent,
    AmountControlledInputComponent,
    HowToPayComponent
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
    MatProgressSpinnerModule,
    MatRadioModule,
    MatAutocompleteModule,
    PipesModule,
    DirectivesModule,
    MatDialogModule,
    MessageModule,
    ValidatorsModule.forRoot(),
    NgxMaskModule.forRoot(ngxMaskOptions),
    PerfectScrollbarModule
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
    MatProgressSpinnerModule,
    MatRadioModule,
    MatAutocompleteModule,
    PipesModule,
    DirectivesModule,
    ValidatorsModule,
    NgxMaskModule,
    PerfectScrollbarModule,
    // Developed Components
    ArticleCardComponent,
    ShopContentItemComponent,
    ShopFiltersComponent,
    AmountControlledInputComponent,
    HowToPayComponent
  ],
  providers: [
    ...PROVIDERS
  ],
  entryComponents: [
  ],
  bootstrap: [
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
