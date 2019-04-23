import { Component, Input, OnInit } from '@angular/core';
import { FlowerType } from "../../../../api/models/FlowerType";

@Component({
  selector: 'news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss']
})
export class NewsCardComponent implements OnInit {

  @Input()
  flowerType: FlowerType;

  constructor() { }

  ngOnInit() {
  }

}
