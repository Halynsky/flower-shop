import { Component, Input, OnInit } from '@angular/core';
import { Flower } from "../../../api/models/Flower";
import { SnackBarService } from "../../../services/snak-bar.service";

@Component({
  selector: 'shop-content-item',
  templateUrl: './shop-content-item.component.html',
  styleUrls: ['./shop-content-item.component.scss']
})
export class ShopContentItemComponent implements OnInit {

  @Input()
  public flower: Flower;

  constructor(private snackBar: SnackBarService) { }

  ngOnInit() {
  }

  addToFavorite(event) {
    this.snackBar.methodNotImplemented();
    event.stopPropagation();
  }

  addToCard(event) {
    event.stopPropagation();
    this.snackBar.methodNotImplemented();
  }

}
