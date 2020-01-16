import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { SizeService } from "../../../api/services/size.service";
import { MatCheckbox, MatCheckboxChange } from "@angular/material";
import { ColorService } from "../../../api/services/color.service";
import { FlowerType } from "../../../api/models/FlowerType";
import { Size } from "../../../api/models/Size";
import { Color } from "../../../api/models/Color";
import { ShopFilter } from "../../../api/models/ShopFilter";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { getErrorMessage } from "../../../utils/Functions";

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

  hashFlowerTypes: Array<string> = [];
  hashColors: Array<string> = [];
  hashSizes: Array<string> = [];

  @ViewChildren('flowerTypeCheckbox') flowerTypeCheckboxes: QueryList<MatCheckbox>;
  @ViewChildren('sizeCheckbox') sizeCheckboxes: QueryList<MatCheckbox>;
  @ViewChildren('colorCheckbox') colorCheckboxes: QueryList<MatCheckbox>;

  constructor(private flowerTypeService: FlowerTypeService,
              private sizeService: SizeService,
              private colorService: ColorService,
              private snackBarService: SnackBarService,
              private route: ActivatedRoute,
              private location: Location) {
    flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => this.snackBarService.showError(getErrorMessage(error))
    );

    sizeService.getAll().subscribe(
      sizes => this.sizes = sizes,
      error => this.snackBarService.showError(getErrorMessage(error))
    );

    colorService.getAll().subscribe(
      colors => this.colors = colors,
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }

  readHash() {
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment) {
        this.getHashParams(fragment);
      }
    });

    this.filters.colorFilters = this.hashColors;
    this.filters.flowerTypeFilters = this.hashFlowerTypes;
    this.filters.sizeFilters = this.hashSizes;
    this.emitFilterChange();
  }

  ngOnInit() {
    this.readHash();
  }

  onFlowerTypeFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.hashFlowerTypes.find(item => item == event.source.value) == undefined)
        this.hashFlowerTypes.push(event.source.value);
    } else {
      let indexOfHash = this.hashFlowerTypes.indexOf(event.source.value);
      if (indexOfHash > -1) {
        this.hashFlowerTypes.splice(indexOfHash, 1);
      }
    }
    this.emitFilterChange();
  }

  onColorFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.hashColors.find(item => item == event.source.value) == undefined)
        this.hashColors.push(event.source.value);
    } else {
      let indexOfHash = this.hashColors.indexOf(event.source.value);
      if (indexOfHash > -1) {
        this.hashColors.splice(indexOfHash, 1);
      }
    }
    this.emitFilterChange();
  }

  onSizeFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.hashSizes.find(item => item == event.source.value) == undefined)
        this.hashSizes.push(event.source.value);
    } else {
      let indexOfHash = this.hashSizes.indexOf(event.source.value);
      if (indexOfHash > -1) {
        this.hashSizes.splice(indexOfHash, 1);
      }
    }
    this.emitFilterChange();
  }

  clearFlowerTypeFilters() {
    this.filters.flowerTypeFilters = [];
    this.flowerTypeCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.hashFlowerTypes = [];
    this.emitFilterChange()
  }

  clearColorFilters() {
    this.filters.colorFilters = [];
    this.colorCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.hashColors = [];
    this.emitFilterChange()
  }

  clearSizeFilters() {
    this.filters.sizeFilters = [];
    this.sizeCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.hashSizes = [];
    this.emitFilterChange()
  }

  emitFilterChange() {
    this.addFiltersToUrl();
    this.onFilterChange.emit(this.filters);
  }

  trackByFn(index, item) {
    return item.id
  }

  addFiltersToUrl() {
    let path = [];
    let hash = '#';
    if (this.hashFlowerTypes.length > 0)
      path.push('flowerTypes=' + this.hashFlowerTypes);
    if (this.hashColors.length > 0)
      path.push('colors=' + this.hashColors);
    if (this.hashSizes.length > 0)
      path.push('sizes=' + this.hashSizes);
    if (this.hashFlowerTypes.length == 0 && this.hashColors.length == 0 && this.hashSizes.length == 0)
      hash = '';
    this.location.go('shop' + hash + path.join('&'));
  }

  getHashParams(hash) {
    let arraysOfFilters = hash.split('&');
    arraysOfFilters.forEach(item => {
      let key = item.split('=')[0];
      let numbers = item.split('=')[1];
      let arrayOfNumbers = numbers.split(',');
      if (key == 'flowerTypes') {
        arrayOfNumbers.forEach(item => {
          item = parseInt(item);
          this.hashFlowerTypes.push(item);
        });
      }
      if (key == 'colors') {
        arrayOfNumbers.forEach(item => {
          item = parseInt(item);
          this.hashColors.push(item);
        });
      }
      if (key == 'sizes') {
        arrayOfNumbers.forEach(item => {
          item = parseInt(item);
          this.hashSizes.push(item);
        });
      }
    })
  }

}
