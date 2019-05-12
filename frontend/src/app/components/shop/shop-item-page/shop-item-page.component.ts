import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FlowerService } from "../../../api/services/flower.service";
import { Flower } from "../../../api/models/Flower";

@Component({
  selector: 'shop-item-page',
  templateUrl: './shop-item-page.component.html',
  styleUrls: ['./shop-item-page.component.scss']
})
export class ShopItemPageComponent implements OnInit {

  id: number;
  flower: Flower;

  constructor(private route: ActivatedRoute, private flowerService: FlowerService) {

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

}
