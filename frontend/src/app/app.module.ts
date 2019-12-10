import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { routing } from "./app.routing";
import { LayoutComponent } from "./layout/layout.component";
import { LandingModule } from "./components/landing/landing.module";
import { MatDialogModule, MatIconModule, MatIconRegistry } from '@angular/material';
import { LayoutModule } from "./layout/layout.module";
import { DatePipe, registerLocaleData } from '@angular/common';
import localeRuUa from '@angular/common/locales/uk';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { SharedModule } from "./components/shared/shared/shared.module";
import { UserModule } from "./components/user/user.module";
import { MainInterceptor } from "./inteceptors/main.interceptor";
import { AuthDialogComponent } from "./components/shared/shared/auth-dialog/auth-dialog.component";
import { BucketDialogComponent } from "./components/shared/shared/bucket-dialog/bucket-dialog.component";
import { AuthService, AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule } from "angularx-social-login";
import { ValidatorModule } from "./validators/validator.module";

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
    BucketDialogComponent
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
    UserModule,
    SocialLoginModule,
    ValidatorModule.forRoot()
  ],
  providers: [
    [DatePipe],
    MatIconRegistry,
    {provide: LOCALE_ID, useValue: "uk"},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true
    },
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  exports: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
