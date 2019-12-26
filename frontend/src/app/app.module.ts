import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { routing } from "./app.routing";
import { LayoutComponent } from "./layout/layout.component";
import { LandingModule } from "./components/landing/landing.module";
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialogModule, MatIconModule, MatIconRegistry } from '@angular/material';
import { LayoutModule } from "./layout/layout.module";
import { DatePipe, registerLocaleData } from '@angular/common';
import localeRuUa from '@angular/common/locales/uk';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { SharedModule } from "./components/shared/shared/shared.module";
import { MainInterceptor } from "./inteceptors/main.interceptor";
import { AuthDialogComponent } from "./components/shared/shared/auth-dialog/auth-dialog.component";
import { BucketDialogComponent } from "./components/shared/shared/bucket-dialog/bucket-dialog.component";
import { AuthServiceConfig, FacebookLoginProvider, SocialLoginModule } from "angularx-social-login";
import { ValidatorModule } from "./validators/validator.module";
import { UserCabinetModule } from "./components/user-cabinet/user-cabinet.module";
import { ShopFilterDialogComponent } from "./components/shared/shared/shop-filter-dialog/shop-filter-dialog.component";

registerLocaleData(localeRuUa);

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(environment.facebookClientId)
      }
    ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  entryComponents: [
    AuthDialogComponent,
    BucketDialogComponent,
    ShopFilterDialogComponent
  ],
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    routing,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    // Developed modules
    LayoutModule,
    LandingModule,
    SharedModule,
    MatDialogModule,
    UserCabinetModule,
    SocialLoginModule,
    ValidatorModule.forRoot()
  ],
  providers: [
    DatePipe,
    MatIconRegistry,
    {provide: 'Window', useValue: window},
    {provide: LOCALE_ID, useValue: "uk"},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true
    },
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {...new MatDialogConfig(), panelClass: 'modal-panel-class', maxWidth: '', disableClose: true, autoFocus: false, maxHeight: '100vh'} as MatDialogConfig}
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


