import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { routing } from "./app.routing";
import { LayoutComponent } from "./layout/layout.component";
import { LandingModule } from "./components/landing/landing.module";
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialogModule, MatIconModule, MatIconRegistry, MatProgressSpinnerModule } from '@angular/material';
import { LayoutModule } from "./layout/layout.module";
import { DatePipe, registerLocaleData } from '@angular/common';
import localeRuUa from '@angular/common/locales/uk';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { SharedModule } from "./components/shared/shared.module";
import { MainInterceptor } from "./inteceptors/main.interceptor";
import { AuthDialogComponent } from "./components/shared/auth-dialog/auth-dialog.component";
import { BucketDialogComponent } from "./components/shared/bucket-dialog/bucket-dialog.component";
import { AuthServiceConfig, FacebookLoginProvider, SocialLoginModule } from "angularx-social-login";
import { ValidatorsModule } from "./validators/validators.module";
import { UserCabinetModule } from "./components/user-cabinet/user-cabinet.module";
import { ShopFilterDialogComponent } from "./components/shared/shop-filter-dialog/shop-filter-dialog.component";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { AddToBucketDialogComponent } from "./components/shared/add-to-bucket-dialog/add-to-bucket-dialog.component";
import { HowToPayDialogComponent } from "./components/shared/how-to-pay-dialog/how-to-pay-dialog.component";

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
    ShopFilterDialogComponent,
    AddToBucketDialogComponent,
    HowToPayDialogComponent
  ],
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    routing,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    // Developed modules
    LayoutModule,
    LandingModule,
    SharedModule,
    UserCabinetModule,
    SocialLoginModule,
    ValidatorsModule.forRoot()
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
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {...new MatDialogConfig(), panelClass: 'modal-panel-class', maxWidth: '', disableClose: true, autoFocus: false, maxHeight: '100vh'} as MatDialogConfig},
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
    ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


