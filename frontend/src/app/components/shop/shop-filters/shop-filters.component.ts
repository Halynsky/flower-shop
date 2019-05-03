import { Component, OnInit } from '@angular/core';
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { SnackBarService } from "../../../services/snak-bar.service";

@Component({
  selector: 'shop-filters',
  templateUrl: './shop-filters.component.html',
  styleUrls: ['./shop-filters.component.scss']
})
export class ShopFiltersComponent implements OnInit {

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

  hasChildrenFn = node => {
    return node.flowers && node.flowers.length > 0;
  }

}
