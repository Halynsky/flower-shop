import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FlowerService } from "../../../api/services/flower.service";
import { FlowerFull } from "../../../api/models/Flower";
import { FlowerSize } from "../../../api/models/FlowerSize";
import { BucketService } from "../../../services/bucket.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { BucketItem } from "../../../models/Bucket";


@Component({
  selector: 'shop-item-page',
  templateUrl: './shop-item-page.component.html',
  styleUrls: ['./shop-item-page.component.scss']
})
export class ShopItemPageComponent implements OnInit {

  private MAX_AMOUNT = 999;

  id: number;
  flower: FlowerFull;
  flowerSize: FlowerSize;
  bucketItems: BucketItem[] = [];

  constructor(private route: ActivatedRoute,
              private flowerService: FlowerService,
              private bucketService: BucketService,
              private snackBarService: SnackBarService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getFlowerById();
    });
  }

  ngOnInit() {
  }


  fillBucketItems(flower: FlowerFull) {
    for (let flowerSize of flower.flowerSizes) {
      let bucketItem = new BucketItem();
      bucketItem.amount = 0;
      bucketItem.price = flowerSize.price;
      bucketItem.flowerSizeId = flowerSize.id;
      bucketItem.image = flower.image;
      bucketItem.name = flower.name;
      bucketItem.size = flowerSize.size.name;
      bucketItem.flowerType = flower.flowerType.nameSingle;
      this.bucketItems.push(bucketItem);
    }
  }

  getFlowerById() {
    this.flowerService.getFlowerFullById(this.id).subscribe(
      flower => {
        this.flower = flower;
        this.fillBucketItems(this.flower)
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }


  minusAmount(flowerSizeIndex: number) {
    if (this.bucketItems[flowerSizeIndex].amount > 0) {
      this.bucketItems[flowerSizeIndex].amount--
    }
  }

  plusAmount(flowerSizeIndex: number) {
    if (this.bucketItems[flowerSizeIndex].amount < this.MAX_AMOUNT) {
      this.bucketItems[flowerSizeIndex].amount++
    }
  }

  addToBucket() {
    if (this.getSelectedAmount() > 0) {
      this.bucketService.addToBucket(this.bucketItems.filter(item => item.amount > 0));
      this.bucketItems = [];
      this.fillBucketItems(this.flower);
    } else {
      this.snackBarService.showWarning("Вкажіть, будь ласка, кількість товару яку ви хочете придбати");
    }

  }

  getSelectedAmount() {
    return this.bucketItems.reduce(((accumulator, item) => accumulator + item.amount), 0)
  }

}
