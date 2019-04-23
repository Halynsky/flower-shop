import { Component, OnInit } from '@angular/core';
import { FlowerTypeService } from "../../api/services/flower-type.service";
import { FlowerType } from "../../api/models/FlowerType";

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  flowerTypes: FlowerType[] = [];

  constructor(private flowerTypeService : FlowerTypeService) {

    flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => console.error(error)
    )

  }

  ngOnInit() {
  }

}
