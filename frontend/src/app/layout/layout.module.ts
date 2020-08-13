import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from "../components/shared/shared.module";
import { CatalogModule } from "../components/catalog/catalog.module";


@NgModule({
    imports: [
        SharedModule.forRoot(),
        CatalogModule
    ],
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent,
  ]
})
export class LayoutModule {

}
