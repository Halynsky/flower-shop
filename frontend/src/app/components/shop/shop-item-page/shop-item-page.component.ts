import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FlowerService } from "../../../api/services/flower.service";
import { FlowerFull } from "../../../api/models/Flower";
import { FlowerSize } from "../../../api/models/FlowerSize";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
import { BottomSheetOverview } from "../../shared/shared/bottom-sheet/bottom-sheet.component";
import { BucketItem } from "../../../models/BucketItem";
import { BucketService } from "../../../services/bucket.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";


@Component({
  selector: 'shop-item-page',
  templateUrl: './shop-item-page.component.html',
  styleUrls: ['./shop-item-page.component.scss']
})
export class ShopItemPageComponent implements OnInit {

  private MAX_AMOUNT = 999;

  id: number;
  flower: FlowerFull;
  amountCounter: number = 1;
  flowerSize: FlowerSize;
  totalPrice: number = 1;
  bottomSheetRef: MatBottomSheetRef;
  bucketItems: Array<BucketItem> = [];

  constructor(private route: ActivatedRoute,
              private flowerService: FlowerService,
              private bucketService: BucketService,
              private snackBarService: SnackBarService,
              private bottomSheet: MatBottomSheet) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getFlowerById();
    });
  }

  ngOnInit() {
  }

  openBottomSheet(): void {
    this.bottomSheetRef = this.bottomSheet.open(BottomSheetOverview);
  }

  addToBucket() {

  }

  fillBucketItems(flower: FlowerFull) {
    for (let flowerSize of flower.flowerSizes) {
      let bucketItem = new BucketItem();
      bucketItem.amount = 0;
      bucketItem.flowerSizeId = flowerSize.id;
      bucketItem.image = flower.image;
      bucketItem.name = flower.name;
      bucketItem.size = flowerSize.size.name;
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
}
