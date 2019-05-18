import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatButtonModule, MatButtonToggleModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule, MatSelectModule,
  MatSnackBarModule
} from "@angular/material";
import { ArticleCardComponent } from './article-card/article-card.component';
import { RouterModule } from "@angular/router";

const PROVIDERS = [
  { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000, panelClass: "snack-custom-class"} }
];

@NgModule({
  declarations: [
    ArticleCardComponent
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
    MatSelectModule
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
    // Developed components
    ArticleCardComponent
  ],
  providers: [
    ...PROVIDERS
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ ...PROVIDERS ]
    };
  }
}


