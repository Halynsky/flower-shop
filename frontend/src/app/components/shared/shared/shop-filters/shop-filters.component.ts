import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FlowerTypeService } from "../../../../api/services/flower-type.service";
import { SnackBarService } from "../../../../services/snak-bar.service";
import { SizeService } from "../../../../api/services/size.service";
import { MatCheckbox, MatCheckboxChange } from "@angular/material";
import { ColorService } from "../../../../api/services/color.service";
import { FlowerType } from "../../../../api/models/FlowerType";
import { Size } from "../../../../api/models/Size";
import { Color } from "../../../../api/models/Color";
import { ShopFilter } from "../../../../api/models/ShopFilter";

@Component({
  selector: 'shop-filters',
  templateUrl: './shop-filters.component.html',
  styleUrls: ['./shop-filters.component.scss']
})
export class ShopFiltersComponent implements OnInit {

  @Input()
  filters = new ShopFilter();
  @Output()
  onFilterChange: EventEmitter<any> = new EventEmitter();

  flowerTypes: FlowerType[] = [];
  sizes: Size[] = [];
  colors: Color[] = [];

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
      this.filters.flowerTypeFilters.push(event.source.value)
    } else {
      let index = this.filters.flowerTypeFilters.indexOf(event.source.value);
      if (index > -1) {
        this.filters.flowerTypeFilters.splice(index, 1);
      }
    }
    this.emitFilterChange()
  }

  onColorFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.filters.colorFilters.push(event.source.value)
    } else {
      let index = this.filters.colorFilters.indexOf(event.source.value);
      if (index > -1) {
        this.filters.colorFilters.splice(index, 1);
      }
    }
    this.emitFilterChange()
  }

  onSizeFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.filters.sizeFilters.push(event.source.value)
    } else {
      let index = this.filters.sizeFilters.indexOf(event.source.value);
      if (index > -1) {
        this.filters.sizeFilters.splice(index, 1);
      }
    }
    this.emitFilterChange()
  }

  clearFlowerTypeFilters() {
    this.filters.flowerTypeFilters = [];
    this.flowerTypeCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.emitFilterChange()
  }

  clearColorFilters() {
    this.filters.colorFilters = [];
    this.colorCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.emitFilterChange()
  }

  clearSizeFilters() {
    this.filters.sizeFilters = [];
    this.sizeCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.emitFilterChange()
  }

  emitFilterChange() {
    this.onFilterChange.emit(this.filters)
  }

  trackByFn(index, item) {
    return item.id
  }

}
