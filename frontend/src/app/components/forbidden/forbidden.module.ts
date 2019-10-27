import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { ForbiddenComponent } from "./forbidden.component";

const routes: Routes = [
  { path: '', component: ForbiddenComponent},
];

@NgModule({
  declarations: [
    ForbiddenComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  bootstrap: [
    ForbiddenComponent
  ]
})
export class ForbiddenModule { }
