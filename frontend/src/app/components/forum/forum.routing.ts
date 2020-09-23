import { RouterModule, Routes } from '@angular/router';
import { ForumComponent } from "./forum.component";

const routes: Routes = [
  { path: '', component: ForumComponent},
];

export const FORUM_ROUTES = RouterModule.forChild(routes);
