import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
  MAT_SNACK_BAR_DEFAULT_OPTIONS, MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSnackBarModule
} from "@angular/material";
import { ArticleCardComponent } from './article-card/article-card.component';
import { RouterModule } from "@angular/router";
import { ModalWindowComponent } from "./modal-window/modal-window.component";
import { BottomSheetOverview } from "./bottom-sheet/bottom-sheet.component";
import { PipesModule } from "../../../pipes/pipes.module";

const PROVIDERS = [
  {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000, panelClass: "snack-custom-class"}},
  {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {hasBackdrop: true, backdropClass: "bottom-sheet-custom-class", closeOnNavigation: true}}
];

@NgModule({
  declarations: [
    ArticleCardComponent,
    ModalWindowComponent,
    BottomSheetOverview
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
    PipesModule
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
    PipesModule,
    // Developed components
    ArticleCardComponent,
    ModalWindowComponent
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


