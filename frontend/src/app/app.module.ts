import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { routing } from "./app.routing";
import { LayoutComponent } from "./layout/layout.component";
import { LandingModule } from "./components/landing/landing.module";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatIconModule, MatIconRegistry } from '@angular/material';
import { LayoutModule } from "./layout/layout.module";
import { registerLocaleData } from '@angular/common';
import localeRuUa from '@angular/common/locales/uk';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
registerLocaleData(localeRuUa);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    routing,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    // Developed modules
    LayoutModule,
    LandingModule,
  ],
  providers: [
    MatIconRegistry,
    { provide: LOCALE_ID, useValue: "uk" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
