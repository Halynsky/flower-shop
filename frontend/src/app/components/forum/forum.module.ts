import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared/shared.module";
import { ForumComponent } from "./forum.component";
import { FORUM_ROUTES } from "./forum.routing";

@NgModule({
  declarations: [
    ForumComponent
  ],
  imports: [
    FORUM_ROUTES,
    SharedModule
  ],
  bootstrap: [
    ForumComponent
  ]
})
export class ForumModule { }
