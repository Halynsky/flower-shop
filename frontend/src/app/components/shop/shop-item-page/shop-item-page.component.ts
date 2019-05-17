import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FlowerService } from "../../../api/services/flower.service";
import { FlowerFull } from "../../../api/models/Flower";
import { FlowerSize } from "../../../api/models/FlowerSize";

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
  sumToPay: number;

  constructor(private route: ActivatedRoute, private flowerService: FlowerService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getFlowerById();
    });
  }

  ngOnInit() {
  }

  getFlowerById(){
    this.flowerService.getFlowerFullById(this.id).subscribe(
      flower => this.flower = flower,
      error=> console.error(error)
    )
  }

  counterIncrement() {
    if(this.amountCounter < this.flowerSize.amount) {
      this.amountCounter++;
    }
    this.sumToPay = this.flowerSize.price*this.amountCounter;
  }

  counterDecrement() {
    if(this.amountCounter > 1) {
    this.amountCounter--;
    }
    this.sumToPay = this.flowerSize.price*this.amountCounter;
  }

  trackElement(index ,flowerSize) {
    this.flowerSize = flowerSize;
    this.sumToPay = flowerSize.price;
  }

}
