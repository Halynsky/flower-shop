import { Component, OnInit } from '@angular/core';
import { Size } from "../../../../api/models/Size";

@Component({
  selector: 'app-size-item',
  templateUrl: './size-item.component.html',
  styleUrls: ['./size-item.component.scss']
})
export class SizeItemComponent implements OnInit {

  item: Size = new Size();

  constructor() { }

  ngOnInit() {
  }

}
