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
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

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

  readHash() {
    this.route.fragment.subscribe((fragment: string) => {
      console.log("My hash fragment is here => ", fragment)
      if (fragment) {
        this.getHashParams(fragment);
      }
    });
    let filtersHash = new ShopFilter();
    filtersHash.colorFilters = this.hashColors;
    filtersHash.flowerTypeFilters = this.hashFlowerTypes;
    filtersHash.sizeFilters = this.hashSizes;
    this.emitFilterChange(filtersHash);
  }

  ngOnInit() {
    this.readHash();
  }

  onFlowerTypeFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.hashFlowerTypes.find(item => item == event.source.value) == undefined)
        this.hashFlowerTypes.push(event.source.value);
      this.filters.flowerTypeFilters.push(event.source.value)
    } else {
      let indexOfHash = this.hashFlowerTypes.indexOf(event.source.value);
      if (indexOfHash > -1) {
        this.hashFlowerTypes.splice(indexOfHash, 1);
      }
      let index = this.filters.flowerTypeFilters.indexOf(event.source.value);
      if (index > -1) {
        this.filters.flowerTypeFilters.splice(index, 1);
      }
    }
    this.emitFilterChange(this.filters);
  }

  onColorFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.hashColors.find(item => item == event.source.value) == undefined)
        this.hashColors.push(event.source.value);
      this.filters.colorFilters.push(event.source.value)
    } else {
      let indexOfHash = this.hashColors.indexOf(event.source.value);
      if (indexOfHash > -1) {
        this.hashColors.splice(indexOfHash, 1);
      }
      let index = this.filters.colorFilters.indexOf(event.source.value);
      if (index > -1) {
        this.filters.colorFilters.splice(index, 1);
      }
    }
    this.emitFilterChange(this.filters);
  }

  onSizeFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.hashSizes.find(item => item == event.source.value) == undefined)
        this.hashSizes.push(event.source.value);
      this.filters.sizeFilters.push(event.source.value)
    } else {
      let indexOfHash = this.hashSizes.indexOf(event.source.value);
      if (indexOfHash > -1) {
        this.hashSizes.splice(indexOfHash, 1);
      }
      let index = this.filters.sizeFilters.indexOf(event.source.value);
      if (index > -1) {
        this.filters.sizeFilters.splice(index, 1);
      }
    }
    this.emitFilterChange(this.filters);
  }

  clearFlowerTypeFilters() {
    this.filters.flowerTypeFilters = [];
    this.flowerTypeCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.hashFlowerTypes = [];
    this.emitFilterChange(this.filters)
  }

  clearColorFilters() {
    this.filters.colorFilters = [];
    this.colorCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.hashColors = [];
    this.emitFilterChange(this.filters)
  }

  clearSizeFilters() {
    this.filters.sizeFilters = [];
    this.sizeCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.hashSizes = [];
    this.emitFilterChange(this.filters)
  }

  emitFilterChange(filter) {
    this.addPath();
    this.onFilterChange.emit(filter);
  }

  trackByFn(index, item) {
    return item.id
  }

  addPath() {
    let path = [];
    if (this.hashFlowerTypes.length > 0)
      path.push('flowerTypes=' + this.hashFlowerTypes);
    if (this.hashColors.length > 0)
      path.push('colors=' + this.hashColors);
    if (this.hashSizes.length > 0)
      path.push('sizes=' + this.hashSizes);

    this.location.go('shop#' + path.join('&'));
  }

  getHashParams(hash) {
    let arraysOfFilters = hash.split('&');
    arraysOfFilters.forEach(item => {
      let key = item.split('=')[0];
      let numbers = item.split('=')[1];
      let arrayOfNumbers = numbers.split(',');
      if (key == 'flowerTypes') {
        arrayOfNumbers.forEach(item => {
          this.hashFlowerTypes.push(item);
        });
      }
      if (key == 'colors') {
        arrayOfNumbers.forEach(item => {
          this.hashColors.push(item);
        });
      }
      if (key == 'sizes') {
        arrayOfNumbers.forEach(item => {
          this.hashSizes.push(item);
        });
      }
    })
  }

}
