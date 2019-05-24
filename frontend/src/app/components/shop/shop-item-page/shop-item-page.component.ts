import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FlowerService } from "../../../api/services/flower.service";
import { FlowerBucket, FlowerFull } from "../../../api/models/Flower";
import { FlowerSize } from "../../../api/models/FlowerSize";
import { ModalWindowService } from "../../../api/services/modal-window.service";
import { BucketService } from "../../../api/services/bucket.service";
import { error } from "@angular/compiler/src/util";

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

  constructor(private route: ActivatedRoute, private flowerService: FlowerService, private modalPageService: ModalWindowService, private bucketService: BucketService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getFlowerById();
    });
  }

  ngOnInit() {
  }



  addToTemp() {
    let flowerBucket = {
      "name": this.flower.name,
      "image": this.flower.image,
      "price": this.flowerSize.price,
      "amount": this.amountCounter,
      "size": this.flowerSize.size.name
    };
    this.bucketService.temp = flowerBucket;
    console.log(this.bucketService.temp);
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
