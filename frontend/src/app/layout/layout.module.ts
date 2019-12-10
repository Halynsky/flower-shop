import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from "../components/shared/shared/shared.module";
import { ValidatorModule } from "../validators/validator.module";


@NgModule({
  imports: [
    SharedModule.forRoot()
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
