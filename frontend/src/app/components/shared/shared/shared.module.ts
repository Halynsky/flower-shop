import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatIconModule, MatMenuModule } from "@angular/material";
import { ArticleCardComponent } from './article-card/article-card.component';

@NgModule({
  declarations: [
    ArticleCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    // Developed components
    ArticleCardComponent
  ]
})
export class SharedModule { }
