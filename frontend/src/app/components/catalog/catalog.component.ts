import { Component, Input } from "@angular/core";
import { FlowerTypeService } from "../../api/services/flower-type.service";
import { FlowerTypeImageNameTupleWithAvailable } from "../../api/models/FlowerType";
import { CatalogService } from "../../services/catalog.service";
import { Router } from "@angular/router";

@Component({
  selector: 'catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {

  @Input() isHeader = false;

  flowerTypes: FlowerTypeImageNameTupleWithAvailable[] = [];

  firstFlowerTypes: FlowerTypeImageNameTupleWithAvailable[] = [];

  constructor(private dataService: FlowerTypeService, public catalogService: CatalogService, private router: Router) {
    this.dataService.getAllWithImage().subscribe(flowerTypes => {
      this.flowerTypes = flowerTypes;
      this.sortFlowerTypes();
    })
  }

  sortFlowerTypes() {
    let tempArrayAvailable = [];
    let tempArrayUnavailable = [];
    for (let i = 0; i < this.flowerTypes.length; i++) {
      if (this.flowerTypes[i].availableFlowersCount > 0) tempArrayAvailable.push(this.flowerTypes[i]);
      else tempArrayUnavailable.push(this.flowerTypes[i]);
    }
    this.flowerTypes = [...tempArrayAvailable, ...tempArrayUnavailable];

    let lengthOfFirstItems = 8;
    if (this.flowerTypes.length < 8) {
      lengthOfFirstItems = this.flowerTypes.length;
    }

    for (let i = 0; i < lengthOfFirstItems; i++) {
      this.firstFlowerTypes[i] = this.flowerTypes[i];
    }
  }

  hide() {
    this.catalogService.setShowCatalog(false);
  }

  show() {
    this.catalogService.setShowCatalog(true);
  }

  goToCatalog() {
    this.router.navigateByUrl('/').then(res => {
      this.catalogService.setShowCatalog(true);
    });
  }
}
