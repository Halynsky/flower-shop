import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ForumComponent } from "./forum.component";

const routes: Routes = [
  { path: '', component: ForumComponent},
];

export const FORUM_ROUTES: ModuleWithProviders = RouterModule.forChild(routes);
