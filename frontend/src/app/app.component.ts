import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from "@angular/material";
import { SwUpdate } from "@angular/service-worker";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public matIconRegistry: MatIconRegistry,
              private swUpdate: SwUpdate) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
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
    }
  }

}
