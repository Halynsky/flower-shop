import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared/shared.module";
import { ContactsComponent } from "./contacts.component";
import { CONTACTS_ROUTES } from "./contacts.routing";


@NgModule({
  declarations: [
    ContactsComponent
  ],
  imports: [
    CONTACTS_ROUTES,
    SharedModule
  ],
  bootstrap: [
    ContactsComponent
  ]
})
export class ContactsModule { }
