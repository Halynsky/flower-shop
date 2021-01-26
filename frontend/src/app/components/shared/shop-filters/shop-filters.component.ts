import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { SizeService } from "../../../api/services/size.service";
import { ColorService } from "../../../api/services/color.service";
import { FlowerType } from "../../../api/models/FlowerType";
import { Color } from "../../../api/models/Color";
import { getErrorMessage } from "../../../utils/Functions";
import { Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { MatCheckbox, MatCheckboxChange } from "@angular/material/checkbox";
import { ActivatedRoute, Router } from "@angular/router";
import { ShopFilterService } from "../../../services/shop-filter.service";

@Component({
  selector: 'shop-filters',
  templateUrl: './shop-filters.component.html',
  styleUrls: ['./shop-filters.component.scss']
})
export class ShopFiltersComponent implements OnInit {

  @ViewChildren('flowerTypeCheckbox') flowerTypeCheckboxes: QueryList<MatCheckbox>;
  @ViewChildren('colorCheckbox') colorCheckboxes: QueryList<MatCheckbox>;

  @Input() emitOnInit = true;

  flowerTypes: FlowerType[];
  colors: Color[];

  showAll = false;

  constructor(private flowerTypeService: FlowerTypeService,
              private sizeService: SizeService,
              private colorService: ColorService,
              private snackBarService: SnackBarService,
              private route: ActivatedRoute,
              private router: Router,
              public shopFilterService: ShopFilterService) {

    flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => this.snackBarService.showError(getErrorMessage(error))
    );

    colorService.getAll().subscribe(
      colors => this.colors = colors,
      error => this.snackBarService.showError(getErrorMessage(error))
    );

  }

  ngOnInit() {

  }

  onFlowerTypeFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.shopFilterService.filters.flowerTypeFilters.find(item => item == parseInt(event.source.value)) == undefined)
        this.shopFilterService.filters.flowerTypeFilters.push(parseInt(event.source.value));
    } else {
      let index = this.shopFilterService.filters.flowerTypeFilters.indexOf(parseInt(event.source.value));
      if (index > -1) {
        this.shopFilterService.filters.flowerTypeFilters.splice(index, 1);
      }
    }
    this.shopFilterService.afterFilterChange();
  }

  onColorFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.shopFilterService.filters.colorFilters.find(item => item == parseInt(event.source.value)) == undefined)
        this.shopFilterService.filters.colorFilters.push(parseInt(event.source.value));
    } else {
      let index = this.shopFilterService.filters.colorFilters.indexOf(parseInt(event.source.value));
      if (index > -1) {
        this.shopFilterService.filters.colorFilters.splice(index, 1);
      }
    }
    this.shopFilterService.afterFilterChange();
  }

  clearFlowerTypeFilters() {
    this.shopFilterService.filters.flowerTypeFilters = [];
    this.flowerTypeCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.shopFilterService.afterFilterChange();
  }

  clearColorFilters() {
    this.shopFilterService.filters.colorFilters = [];
    this.colorCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.shopFilterService.afterFilterChange();
  }

  trackByFn(index, item) {
    return item.id
  }

}
