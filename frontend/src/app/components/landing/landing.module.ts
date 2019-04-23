import { NgModule } from '@angular/core';
import { LandingComponent } from './landing.component';
import { SharedModule } from "../shared/shared/shared.module";

@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    SharedModule,
  ],
  bootstrap: [
    LandingComponent
  ]
})
export class LandingModule { }
