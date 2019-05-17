import { Component, OnInit } from '@angular/core';
import { FlowerService } from "../../api/services/flower.service";
import { Flower, FlowerShort } from "../../api/models/Flower";
import { SnackBarService } from "../../services/snak-bar.service";

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  flowers: FlowerShort[] = [];

  constructor(private flowerService: FlowerService,
              private snackBarService: SnackBarService) {
    this.getShopItems();
  }

  ngOnInit() {
  }

  getShopItems(filters?) {
    this.flowerService.getForShop(filters).subscribe(
      flowers => this.flowers = flowers,
      error => this.snackBarService.showError(error)
      )
  }

  trackByFn(index, item) {
    return item.id
  }

  onFilterChange($event) {
    console.log($event);
    this.getShopItems($event)
  }

  clearSearch() {

  }

}
