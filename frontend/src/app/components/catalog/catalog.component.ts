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
      this.initFirstFlowerTypes();
    })
  }

  initFirstFlowerTypes() {
    for (let i = 0; i < this.flowerTypes.length; i++) {
      if (this.flowerTypes[i].availableFlowersCount > 0) {
        this.firstFlowerTypes.push(this.flowerTypes[i]);
      }
      if (this.firstFlowerTypes.length === 8) break;
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
