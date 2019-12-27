import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared/shared.module";
import { OrderComponent } from "./order.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: '', component: OrderComponent},
];

@NgModule({
  declarations: [
    OrderComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  bootstrap: [
    OrderComponent
  ]
})
export class OrderModule { }
