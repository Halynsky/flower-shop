import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ContactsComponent } from "./contacts.component";

const routes: Routes = [
  { path: '', component: ContactsComponent},
];

export const CONTACTS_ROUTES: ModuleWithProviders = RouterModule.forChild(routes);
