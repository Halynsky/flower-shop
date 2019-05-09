import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { SizeService } from "../../../api/services/size.service";
import { MatCheckbox, MatCheckboxChange } from "@angular/material";
import { ColorService } from "../../../api/services/color.service";
import { FlowerType } from "../../../api/models/FlowerType";
import { Size } from "../../../api/models/Size";
import { Color } from "../../../api/models/Color";

@Component({
  selector: 'shop-filters',
  templateUrl: './shop-filters.component.html',
  styleUrls: ['./shop-filters.component.scss']
})
export class ShopFiltersComponent implements OnInit {

  flowerTypes: FlowerType[] = [];
  sizes: Size[] = [];
  colors: Color[] = [];

  flowerTypeFilters = [];
  sizeFilters = [];
  colorFilters = [];

  @ViewChildren('flowerTypeCheckbox') flowerTypeCheckboxes: QueryList<MatCheckbox>;
  @ViewChildren('sizeCheckbox') sizeCheckboxes: QueryList<MatCheckbox>;
  @ViewChildren('colorCheckbox') colorCheckboxes: QueryList<MatCheckbox>;

  constructor(private flowerTypeService: FlowerTypeService,
              private sizeService: SizeService,
              private colorService: ColorService,
              private snackBarService: SnackBarService) {

    flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => snackBarService.showError(error)
    );

    sizeService.getAll().subscribe(
      sizes => this.sizes = sizes,
      error => snackBarService.showError(error)
    );

    colorService.getAll().subscribe(
      colors => this.colors = colors,
      error => snackBarService.showError(error)
    );

  }

  ngOnInit() {
  }

  onFlowerTypeFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.flowerTypeFilters.push(event.source.value)
    } else {
      let index = this.flowerTypeFilters.indexOf(event.source.value);
      if (index > -1) {
        this.flowerTypeFilters.splice(index, 1);
      }
    }
  }

  onColorFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.colorFilters.push(event.source.value)
    } else {
      let index = this.colorFilters.indexOf(event.source.value);
      if (index > -1) {
        this.colorFilters.splice(index, 1);
      }
    }
  }

  onSizeFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.sizeFilters.push(event.source.value)
    } else {
      let index = this.sizeFilters.indexOf(event.source.value);
      if (index > -1) {
        this.sizeFilters.splice(index, 1);
      }
    }
  }

  clearFlowerTypeFilters() {
    this.flowerTypeFilters = [];
    this.flowerTypeCheckboxes.forEach(checkbox => checkbox.writeValue(false));
  }

  clearColorFilters() {
    this.colorFilters = [];
    this.colorCheckboxes.forEach(checkbox => checkbox.writeValue(false));
  }

  clearSizeFilters() {
    this.sizeFilters = [];
    this.sizeCheckboxes.forEach(checkbox => checkbox.writeValue(false));
  }

  trackByFn(index, item) {
    return item.id
  }

}
