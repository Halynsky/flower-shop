import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from "@angular/material";
import { SwUpdate } from "@angular/service-worker";
import { interval } from "rxjs";
import { environment } from "../environments/environment";

import * as moment from 'moment'
import 'moment/locale/uk'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  EACH_MINUTE_INTERVAL = 60 * 1000;

  constructor(public matIconRegistry: MatIconRegistry,
              private swUpdate: SwUpdate) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    moment.locale('uk');
    console.log("APP CONSTRUCTED");
  }

  ngOnInit() {

    console.log("APP INIT");

    console.log("environment.production", environment.production);
    console.log("this.swUpdate.isEnabled", this.swUpdate.isEnabled);

    this.checkSwUpdate();

    if (environment.production) {
      interval(this.EACH_MINUTE_INTERVAL).subscribe(() => {
        this.swUpdate.checkForUpdate().then(() => {
          console.log('SW checking for updates');
        });
      });

    }
  }

  checkSwUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        alert('Доступна нова версія нашого сервісу. Ми повинні оновити сторінку щоб відобразити для вас актуальну версію.');
        window.location.reload();
      });
    }
  }

}
