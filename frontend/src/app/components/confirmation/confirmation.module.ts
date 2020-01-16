import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { ConfirmationComponent } from "./confirmation.component";
import { ConfirmationActivationComponent } from "./confirmation-activation/confirmation-activation.component";
import { ConfirmationErrorComponent } from "./confirmation-error/confirmation-error.component";
import { ConfirmationPasswordRestoreComponent } from "./confirmation-password-restore/confirmation-password-restore.component";
import { ConfirmationEmailChangeComponent } from "./confirmation-email-change/confirmation-email-change.component";

const routes: Routes = [
  {path: '', component: ConfirmationComponent},
  {path: 'activation', component: ConfirmationActivationComponent},
  {path: 'password-restore', component: ConfirmationPasswordRestoreComponent},
  {path: 'email', component: ConfirmationEmailChangeComponent},
];

@NgModule({
  declarations: [
    ConfirmationComponent,
    ConfirmationErrorComponent,
    ConfirmationActivationComponent,
    ConfirmationPasswordRestoreComponent,
    ConfirmationEmailChangeComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  bootstrap: [
    ConfirmationComponent,
    ConfirmationErrorComponent,
    ConfirmationActivationComponent,
    ConfirmationPasswordRestoreComponent,
    ConfirmationEmailChangeComponent
  ]
})
export class ConfirmationModule { }
