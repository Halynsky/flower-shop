import { NgModule } from "@angular/core";
import { CatalogCardComponent } from "./catalog-card/catalog-card.component";
import { CatalogComponent } from "./catalog.component";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    CatalogCardComponent,
    CatalogComponent
  ],
  imports: [
    MatIconModule,
    CommonModule

  ],
    exports: [
        CatalogCardComponent,
        CatalogComponent
    ],
  bootstrap: []
})
export class CatalogModule {
}
