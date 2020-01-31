import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from "@angular/material";
import { SwUpdate } from "@angular/service-worker";
import { interval } from "rxjs";
import { environment } from "../environments/environment";

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
  }

  ngOnInit() {
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
