import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FlowerTypeImageNameTupleWithAvailable } from "../../../api/models/FlowerType";
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { Router } from "@angular/router";
import { CatalogService } from "../../../services/catalog.service";

@Component({
  selector: 'catalog-dialog',
  templateUrl: './catalog-dialog.component.html',
  styleUrls: ['./catalog-dialog.component.scss']
})
export class CatalogDialogComponent {

  flowerTypes: FlowerTypeImageNameTupleWithAvailable[] = [];

  firstFlowerTypes: FlowerTypeImageNameTupleWithAvailable[] = [];

  constructor(public dialogRef: MatDialogRef<CatalogDialogComponent>, private dataService: FlowerTypeService, private router: Router, public catalogService: CatalogService) {
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
      if (this.firstFlowerTypes.length === 6) break;
    }
  }


  goToCatalog() {
    this.router.navigateByUrl('/').then(res => {
      this.catalogService.setShowCatalog(true);
    });
  }

}
