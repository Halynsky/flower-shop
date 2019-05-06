import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from "./layout/layout.component";
import { LandingComponent } from "./components/landing/landing.component";

const routes: Routes = [
  { path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: LandingComponent},
      { path: 'shop', loadChildren: './components/shop/shop.module#ShopModule'},
      { path: 'forum', loadChildren: './components/forum/forum.module#ForumModule'},
      { path: 'contacts', loadChildren: './components/contacts/contacts.module#ContactsModule'}
    ]
  },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', useHash: false });


