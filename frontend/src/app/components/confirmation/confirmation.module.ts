import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { ConfirmationComponent } from "./confirmation.component";
import { ConfirmationActivationComponent } from "./confirmation-activation/confirmation-activation.component";

const routes: Routes = [
  {path: '', component: ConfirmationComponent},
  {path: '/activation', component: ConfirmationActivationComponent},
];

@NgModule({
  declarations: [
    ConfirmationComponent,
    ConfirmationActivationComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  bootstrap: [
    ConfirmationComponent,
    ConfirmationActivationComponent
  ]
})
export class ConfirmationModule { }
