import { Component, OnInit, ViewChild } from '@angular/core';
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { FilterTreeComponent } from "./filter-tree/filter-tree.component";

@Component({
  selector: 'shop-filters',
  templateUrl: './shop-filters.component.html',
  styleUrls: ['./shop-filters.component.scss']
})
export class ShopFiltersComponent implements OnInit {

  @ViewChild('flowerTypeFilterEl') flowerTypeFilter: FilterTreeComponent;

  catalogRoot = [];

  constructor(private flowerTypeService: FlowerTypeService,
              private snackBarService: SnackBarService) {
    flowerTypeService.getAll().subscribe(
      flowerTypes => this.catalogRoot = flowerTypes,
      error => snackBarService.showError(error)
    )
  }

  ngOnInit() {
  }

}
