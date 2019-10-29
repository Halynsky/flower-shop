import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from "./layout/layout.component";
import { LandingComponent } from "./components/landing/landing.component";
import {SecurityService as securityService} from "./services/security.service";
import { UserComponent } from "./components/user/user.component";
import { ProfileComponent } from "./components/user/profile/profile.component";
import { WishlistComponent } from "./components/user/wishlist/wishlist.component";
import { PurchaseHistoryComponent } from "./components/user/purchase-history/purchase-history.component";
import { FavouriteArticlesComponent } from "./components/user/favourite-articles/favourite-articles.component";
import { AdminGuard } from "./guards/admin-panel.guard";

const routes: Routes = [
  { path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: LandingComponent},
      { path: 'my', component: UserComponent, canActivate: [securityService], children: [
          { path: 'profile', component: ProfileComponent},
          { path: 'wishlist', component: WishlistComponent},
          { path: 'purchases', component: PurchaseHistoryComponent},
          { path: 'favourite-articles', component: FavouriteArticlesComponent}
        ] },
      { path: 'shop', loadChildren: './components/shop/shop.module#ShopModule'},
      { path: 'forum', loadChildren: './components/forum/forum.module#ForumModule'},
      { path: 'contacts', loadChildren: './components/contacts/contacts.module#ContactsModule'},
      { path: '403', loadChildren: './components/forbidden/forbidden.module#ForbiddenModule'}
    ]
  },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule', canLoad: [AdminGuard]}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', useHash: false });


