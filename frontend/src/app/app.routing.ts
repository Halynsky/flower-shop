import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from "./layout/layout.component";
import { UserCabinetComponent } from "./components/user-cabinet/user-cabinet.component";
import { ProfileComponent } from "./components/user-cabinet/profile/profile.component";
import { WishlistComponent } from "./components/user-cabinet/wishlist/wishlist.component";
import { PurchaseHistoryComponent } from "./components/user-cabinet/purchase-history/purchase-history.component";
import { FavouriteArticlesComponent } from "./components/user-cabinet/favourite-articles/favourite-articles.component";
import { AdminPanelGuard } from "./guards/admin-panel.guard";
import { UserGuard } from "./guards/user.guard";

const routes: Routes = [
  { path: '',
    component: LayoutComponent,
    children: [
      // { path: '', component: LandingComponent},
      { path: '', redirectTo:'shop', pathMatch: 'full'},
      { path: 'my', component: UserCabinetComponent, canActivate: [UserGuard], canActivateChild: [UserGuard] , children: [
          { path: 'profile', component: ProfileComponent},
          { path: 'wishlist', component: WishlistComponent},
          { path: 'purchases', component: PurchaseHistoryComponent},
          { path: 'favourite-articles', component: FavouriteArticlesComponent}
        ] },
      { path: 'order', loadChildren: './components/order/order.module#OrderModule'},
      { path: 'confirm', loadChildren: './components/confirmation/confirmation.module#ConfirmationModule'},
      { path: 'shop', loadChildren: './components/shop/shop.module#ShopModule'},
      // { path: 'forum', loadChildren: './components/forum/forum.module#ForumModule'},
      { path: 'contacts', loadChildren: './components/contacts/contacts.module#ContactsModule'},
      { path: '403', loadChildren: './components/forbidden/forbidden.module#ForbiddenModule'}
    ]
  },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule', canLoad: [AdminPanelGuard]}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', useHash: false });

