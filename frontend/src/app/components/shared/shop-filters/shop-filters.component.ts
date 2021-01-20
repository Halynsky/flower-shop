import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { SizeService } from "../../../api/services/size.service";
import { ColorService } from "../../../api/services/color.service";
import { FlowerType } from "../../../api/models/FlowerType";
import { Color } from "../../../api/models/Color";
import { ShopFilter } from "../../../api/models/ShopFilter";
import { getErrorMessage } from "../../../utils/Functions";
import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from "@angular/core";
import { MatCheckbox, MatCheckboxChange } from "@angular/material/checkbox";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";

@Component({
  selector: 'shop-filters',
  templateUrl: './shop-filters.component.html',
  styleUrls: ['./shop-filters.component.scss']
})
export class ShopFiltersComponent implements OnInit {

  @ViewChildren('flowerTypeCheckbox') flowerTypeCheckboxes: QueryList<MatCheckbox>;
  @ViewChildren('colorCheckbox') colorCheckboxes: QueryList<MatCheckbox>;

  @Input() filters = new ShopFilter();
  @Input() emitOnInit = true;
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();

  initialized: boolean = false;

  flowerTypes: FlowerType[];
  colors: Color[];

  showAll = false;

  constructor(private flowerTypeService: FlowerTypeService,
              private sizeService: SizeService,
              private colorService: ColorService,
              private snackBarService: SnackBarService,
              private route: ActivatedRoute,
              private router: Router) {

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
    this.route.queryParams
      .subscribe(params => {
      let colorFilters = params.colors;
      let flowerTypeFilters = params.flowerTypes;
      this.filters.colorFilters = colorFilters ? colorFilters.split(',').map(i => parseInt(i)) : [];
      this.filters.flowerTypeFilters = flowerTypeFilters ? flowerTypeFilters.split(',').map(i => parseInt(i)) : [];
      this.filters.page = params.page ? params.page : "0";
      this.filters.sort = params.sort ? params.sort : "popularity,DESC";

      if (!this.initialized) {
        if (this.emitOnInit) this.emitFilterChange();
        this.initialized = true;
      } else {
        this.emitFilterChange();
      }

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
    this.filters.page = "0"
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
    this.filters.page = "0"
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
    this.route.queryParams
      .pipe(first())
      .subscribe(params => {
        let newParams: any = {...params};

        if (this.filters.colorFilters.length > 0) {
          newParams.colors = this.filters.colorFilters.join(',')
        } else {
          delete newParams.colors
        }

        if (this.filters.flowerTypeFilters.length > 0) {
          newParams.flowerTypes = this.filters.flowerTypeFilters.join(',')
        } else {
          delete newParams.flowerTypes
        }

        newParams.page = this.filters.page;

        this.router.navigate(['shop'], {queryParams: newParams})
      });

  }

}
