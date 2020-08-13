import { Component, Input } from "@angular/core";
import { FlowerTypeService } from "../../api/services/flower-type.service";
import { FlowerTypeImageNameTuple } from "../../api/models/FlowerType";

@Component({
  selector: 'catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {

  @Input() isMain: Boolean = false;

  showFirstEight: Boolean;

  flowerTypes: FlowerTypeImageNameTuple[] = [];

  firstFlowerTypes: FlowerTypeImageNameTuple[] = [];

  constructor(private dataService: FlowerTypeService) {
    this.dataService.getAllWithImage().subscribe(flowerTypes => {
      this.flowerTypes = flowerTypes;
      if (this.isMain) {
        this.initFirstFlowerTypes();
      }
    })
  }

  initFirstFlowerTypes() {
    this.showFirstEight = true;
    for (let i = 0; i < 8; i++) {
      this.firstFlowerTypes.push(this.flowerTypes[i]);
    }
  }

  hide() {
    this.showFirstEight = true;
  }

  show() {
    this.showFirstEight = false;
  }

}
