import {NgModule} from '@angular/core';
import {UserComponent} from "./user.component";
import {USER_ROUTES} from "./user.routing";
import {ProfileComponent} from "./profile/profile.component";
import {WishlistComponent} from "./wishlist/wishlist.component";
import {UserSidebarComponent} from "./user-cabinet-sidebar/user-sidebar.component";

@NgModule({
  declarations: [
    UserComponent,
    ProfileComponent,
    WishlistComponent,
    UserSidebarComponent
  ],
  imports: [
    USER_ROUTES
  ],
  bootstrap: [

  ]
})
export class UserModule { }
