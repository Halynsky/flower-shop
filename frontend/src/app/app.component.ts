import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
import 'moment/locale/uk'
import { MatIconRegistry } from "@angular/material/icon";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public matIconRegistry: MatIconRegistry) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    moment.locale('uk');
  }

  ngOnInit() {
  }

}

