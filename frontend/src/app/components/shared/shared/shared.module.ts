import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatIconModule, MatMenuModule, MatSnackBarModule } from "@angular/material";
import { ArticleCardComponent } from './article-card/article-card.component';
import { RouterModule } from "@angular/router";

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
    MatSnackBarModule
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
    // Developed components
    ArticleCardComponent
  ]
})
export class SharedModule { }
