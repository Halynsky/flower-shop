import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { AboutUsComponent } from "./about-us.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: '', component: AboutUsComponent},
];

@NgModule({
  declarations: [
    AboutUsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  bootstrap: [
    AboutUsComponent
  ]
})
export class AboutUsModule { }
