import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FlowerService } from "../../../api/services/flower.service";
import { FlowerFull } from "../../../api/models/Flower";
import { FlowerSize } from "../../../api/models/FlowerSize";
import { ModalWindowService } from "../../../api/services/modal-window.service";
import { BucketService } from "../../../api/services/bucket.service";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
import { BottomSheetOverview } from "../../shared/shared/bottom-sheet/bottom-sheet.component";
import { BucketItem } from "../../../models/BucketItem";


@Component({
  selector: 'shop-item-page',
  templateUrl: './shop-item-page.component.html',
  styleUrls: ['./shop-item-page.component.scss']
})
export class ShopItemPageComponent implements OnInit {

  id: number;
  flower: FlowerFull;
  amountCounter: number = 1;
  flowerSize: FlowerSize;
  sumToPay: number = 1;
  bottomSheetRef: MatBottomSheetRef;
  bucketItem: BucketItem = new BucketItem();

  constructor(private route: ActivatedRoute, private flowerService: FlowerService, private modalPageService: ModalWindowService, private bucketService: BucketService, private bottomSheet: MatBottomSheet) {
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
    this.bucketItem.amount = this.amountCounter;
    this.bucketItem.name = this.flower.name;
    this.bucketItem.size = this.flowerSize.size.name;
    this.bucketItem.price = this.flowerSize.price;
    this.bucketItem.image = this.flower.image;
    this.bucketService.addPurchase(this.bucketItem);
  }

  getFlowerById() {
    this.flowerService.getFlowerFullById(this.id).subscribe(
      flower => {
        this.flower = flower;
        this.flowerSize = this.flower.flowerSizes[0];
        this.sumToPay = this.flowerSize.price * this.amountCounter;
      },
      error => console.error(error)
    );
  }

  counterIncrement() {
    if (this.amountCounter < this.flowerSize.amount) {
      this.amountCounter++;
    }
    this.sumToPay = this.flowerSize.price * this.amountCounter;
  }

  counterDecrement() {
    if (this.amountCounter > 1) {
      this.amountCounter--;
    }
    this.sumToPay = this.flowerSize.price * this.amountCounter;
  }

  trackElement(index, flowerSize) {
    this.flowerSize = flowerSize;
    this.sumToPay = flowerSize.price;
    this.amountCounter = 1;
  }


}
