import { Component, Input, OnInit } from '@angular/core';
import { Flower } from "../../../api/models/Flower";

@Component({
  selector: 'shop-content-item',
  templateUrl: './shop-content-item.component.html',
  styleUrls: ['./shop-content-item.component.scss']
})
export class ShopContentItemComponent implements OnInit {

  @Input()
  public flower: Flower;

  constructor() { }

  ngOnInit() {
  }

}
