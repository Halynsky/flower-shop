import { Component, OnInit } from '@angular/core';
import { SwUpdate } from "@angular/service-worker";
import { interval } from "rxjs";
import * as moment from 'moment'
import 'moment/locale/uk'
import { MatIconRegistry } from "@angular/material/icon";

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
  }

  ngOnInit() {
    this.checkSwUpdate();
  }

  checkSwUpdate() {

    if (this.swUpdate.isEnabled) {

      this.swUpdate.available.subscribe(() => {
        alert('Доступна нова версія нашого сервісу. Ми повинні оновити сторінку щоб відобразити для вас актуальну версію.');
        window.location.reload();
      });

      interval(this.EACH_MINUTE_INTERVAL).subscribe(() => {
        this.swUpdate.checkForUpdate().then(() => {
          console.log('SW checking for updates');
        });
      });

    }

  }

}

