import { Component, Input } from "@angular/core";
import { FLOWER_IMAGE_PLACEHOLDER } from "../../../utils/Costants";
import { FlowerSize } from "../../../api/models/FlowerSize";
import { FlowerTypeImageNameTuple } from "../../../api/models/FlowerType";

@Component({
  selector: 'catalog-card',
  templateUrl: './catalog-card.component.html',
  styleUrls: ['./catalog-card.component.scss']
})
export class CatalogCardComponent {

  @Input() flowerType: FlowerTypeImageNameTuple;

  flowerImagePlaceholder = FLOWER_IMAGE_PLACEHOLDER;

  constructor() {
  }


}
