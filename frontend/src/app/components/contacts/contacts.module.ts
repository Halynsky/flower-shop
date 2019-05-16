import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared/shared.module";
import { ContactsComponent } from "./contacts.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: '', component: ContactsComponent},
];

@NgModule({
  declarations: [
    ContactsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot()
  ],
  bootstrap: [
    ContactsComponent
  ]
})
export class ContactsModule { }
