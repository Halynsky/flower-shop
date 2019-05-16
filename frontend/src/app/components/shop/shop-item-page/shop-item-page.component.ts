import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FlowerService} from "../../../api/services/flower.service";
import {Flower} from "../../../api/models/Flower";
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'shop-item-page',
  templateUrl: './shop-item-page.component.html',
  styleUrls: ['./shop-item-page.component.scss']
})
export class ShopItemPageComponent implements OnInit {

  id: number;
  flower: Flower;
  amountCounter: number;

  constructor(private route: ActivatedRoute, private flowerService: FlowerService) {
    this.amountCounter = 1;
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getFlowerById();
    });
  }

  ngOnInit() {
  }

  getFlowerById(){
    this.flowerService.getById(this.id).subscribe(
      flower => this.flower = flower,
      error=> console.error(error)
    )
  }

  counterIncrement() {
    // if(this.amountCounter < amountFlower) {
      this.amountCounter++;
    // }
  }

  counterDecrement() {
    if(this.amountCounter > 1) {
    this.amountCounter--;
    }
  }

}
