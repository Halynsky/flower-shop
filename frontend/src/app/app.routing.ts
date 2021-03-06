import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from "./layout/layout.component";
import { UserCabinetComponent } from "./components/user-cabinet/user-cabinet.component";
import { ProfileComponent } from "./components/user-cabinet/profile/profile.component";
import { WishlistComponent } from "./components/user-cabinet/wishlist/wishlist.component";
import { PurchaseHistoryComponent } from "./components/user-cabinet/purchase-history/purchase-history.component";
import { FavouriteArticlesComponent } from "./components/user-cabinet/favourite-articles/favourite-articles.component";
import { AdminPanelGuard } from "./guards/admin-panel.guard";
import { TermsAndConditionsComponent } from "./components/shared/terms-and-conditions/terms-and-conditions.component";
import { AuthenticatedGuard } from "./guards/authenticated.guard";
import { PrivacyPolicyComponent } from "./components/shared/privacy-policy/privacy-policy.component";

const routes: Routes = [
  { path: '',
    component: LayoutComponent,
    children: [
      // { path: '', component: LandingComponent},
      { path: '', redirectTo:'shop', pathMatch: 'full'},
      { path: 'my', component: UserCabinetComponent, canActivate: [AuthenticatedGuard], canActivateChild: [AuthenticatedGuard] , children: [
          { path: 'profile', component: ProfileComponent},
          { path: 'wishlist', component: WishlistComponent},
          { path: 'purchases', component: PurchaseHistoryComponent},
          { path: 'favourite-articles', component: FavouriteArticlesComponent}
        ] },
      { path: 'order', loadChildren: () => import('./components/order/order.module').then(m => m.OrderModule)},
      { path: 'confirm', loadChildren: () => import('./components/confirmation/confirmation.module').then(m => m.ConfirmationModule)},
      { path: 'shop', loadChildren: () => import('./components/shop/shop.module').then(m => m.ShopModule)},
      // { path: 'forum', loadChildren: './components/forum/forum.module#ForumModule'},
      { path: 'about-us', loadChildren: () => import('./components/about-us/about-us.module').then(m => m.AboutUsModule)},
      { path: '403', loadChildren: () => import('./components/forbidden/forbidden.module').then(m => m.ForbiddenModule)},
      { path: 'terms-and-conditions', component: TermsAndConditionsComponent},
      { path: 'privacy-policy', component: PrivacyPolicyComponent}
    ]
  },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canLoad: [AdminPanelGuard]}
];

export const routing = RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', useHash: false, scrollPositionRestoration: 'disabled' });

