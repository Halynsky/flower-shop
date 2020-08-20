import { NgModule } from "@angular/core";
import { CatalogCardComponent } from "./catalog-card/catalog-card.component";
import { CatalogComponent } from "./catalog.component";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { CatalogDialogComponent } from "./catalog-dialog/catalog-dialog.component";

@NgModule({
  declarations: [
    CatalogCardComponent,
    CatalogComponent,
    CatalogDialogComponent
  ],
  imports: [
    MatIconModule,
    CommonModule,
    RouterModule,
    MatButtonModule

  ],
    exports: [
        CatalogCardComponent,
        CatalogComponent
    ],
  bootstrap: []
})
export class CatalogModule {
}
