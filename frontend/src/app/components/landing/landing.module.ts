import { NgModule } from '@angular/core';
import { LandingComponent } from './landing.component';
import { SharedModule } from "../shared/shared.module";
import { CatalogModule } from "../catalog/catalog.module";

@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    SharedModule.forRoot(),
    CatalogModule
  ],
  bootstrap: [
    LandingComponent
  ]
})
export class LandingModule {
}
