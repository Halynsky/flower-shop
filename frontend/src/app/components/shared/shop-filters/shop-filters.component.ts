import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { SizeService } from "../../../api/services/size.service";
import { MatCheckbox, MatCheckboxChange } from "@angular/material";
import { ColorService } from "../../../api/services/color.service";
import { FlowerType } from "../../../api/models/FlowerType";
import { Color } from "../../../api/models/Color";
import { ShopFilter } from "../../../api/models/ShopFilter";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { getErrorMessage } from "../../../utils/Functions";

@Component({
  selector: 'shop-filters',
  templateUrl: './shop-filters.component.html',
  styleUrls: ['./shop-filters.component.scss']
})
export class ShopFiltersComponent implements OnInit {

  @Input() filters = new ShopFilter();
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();

  flowerTypes: FlowerType[] = [];
  colors: Color[] = [];

  @ViewChildren('flowerTypeCheckbox') flowerTypeCheckboxes: QueryList<MatCheckbox>;
  @ViewChildren('colorCheckbox') colorCheckboxes: QueryList<MatCheckbox>;

  constructor(private flowerTypeService: FlowerTypeService,
              private sizeService: SizeService,
              private colorService: ColorService,
              private snackBarService: SnackBarService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location) {

    flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => this.snackBarService.showError(getErrorMessage(error))
    );

    colorService.getAll().subscribe(
      colors => this.colors = colors,
      error => this.snackBarService.showError(getErrorMessage(error))
    );

  }

  readQueryParams() {
    this.route.queryParams.subscribe(params => {
      let colorFilters = params['colors'];
      let flowerTypeFilters = params['flowerTypes'];
      this.filters.colorFilters = colorFilters ? colorFilters.split(',').map(i => parseInt(i)) : [];
      this.filters.flowerTypeFilters = flowerTypeFilters ? flowerTypeFilters.split(',').map(i => parseInt(i)) : [];
      this.emitFilterChange();
    });
  }

  ngOnInit() {
    this.readQueryParams();
  }

  onFlowerTypeFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.filters.flowerTypeFilters.find(item => item == event.source.value) == undefined)
        this.filters.flowerTypeFilters.push(event.source.value);
    } else {
      let index = this.filters.flowerTypeFilters.indexOf(event.source.value);
      if (index > -1) {
        this.filters.flowerTypeFilters.splice(index, 1);
      }
    }
    this.changeUrlFilters();
  }

  onColorFilterChange(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.filters.colorFilters.find(item => item == event.source.value) == undefined)
        this.filters.colorFilters.push(event.source.value);
    } else {
      let index = this.filters.colorFilters.indexOf(event.source.value);
      if (index > -1) {
        this.filters.colorFilters.splice(index, 1);
      }
    }
    this.changeUrlFilters();
  }

  clearFlowerTypeFilters() {
    this.filters.flowerTypeFilters = [];
    this.flowerTypeCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.changeUrlFilters();
  }

  clearColorFilters() {
    this.filters.colorFilters = [];
    this.colorCheckboxes.forEach(checkbox => checkbox.writeValue(false));
    this.changeUrlFilters();
  }

  emitFilterChange() {
    this.onFilterChange.emit(this.filters);
  }

  trackByFn(index, item) {
    return item.id
  }

  changeUrlFilters() {
    let params: any = {};
    if (this.filters.colorFilters.length > 0) {
      params.colors = this.filters.colorFilters.join(',')
    }
    if (this.filters.flowerTypeFilters.length > 0) {
      params.flowerTypes = this.filters.flowerTypeFilters.join(',')
    }

    this.router.navigate(['shop'], {queryParams: params})
  }

}
