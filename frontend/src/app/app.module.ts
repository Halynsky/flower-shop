import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { routing } from "./app.routing";
import { LayoutComponent } from "./layout/layout.component";
import { LandingModule } from "./components/landing/landing.module";
import { LayoutModule } from "./layout/layout.module";
import localeRuUa from '@angular/common/locales/uk';
import { RouterModule } from "@angular/router";
import { SharedModule } from "./components/shared/shared.module";
import { MainInterceptor } from "./inteceptors/main.interceptor";
import { FacebookLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from "angularx-social-login";
import { ValidatorsModule } from "./validators/validators.module";
import { UserCabinetModule } from "./components/user-cabinet/user-cabinet.module";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { DatePipe, registerLocaleData } from "@angular/common";
import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

registerLocaleData(localeRuUa);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  entryComponents: [
  ],
  imports: [
    routing,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    // PerfectScrollbarModule,
    // Developed modules
    LayoutModule,
    LandingModule,
    SharedModule,
    UserCabinetModule,
    SocialLoginModule,
    ValidatorsModule.forRoot(),
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
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        ...new MatDialogConfig(),
        panelClass: 'modal-panel-class',
        maxWidth: '',
        disableClose: true,
        autoFocus: false,
        maxHeight: '100vh'
      } as MatDialogConfig
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false}
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebookClientId),
          },
        ],
      } as SocialAuthServiceConfig
    }
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


