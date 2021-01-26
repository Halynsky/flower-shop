import { EventEmitter, Injectable } from "@angular/core";
import { ShopFilterParams, ShopFilters } from "../api/models/ShopFilters";
import { Router } from "@angular/router";


@Injectable({providedIn: 'root'})
export class ShopFilterService {

  filters = new ShopFilters();
  onFilterChange: EventEmitter<any> = new EventEmitter();
  initialized = false;
  loadingShowMore = false;

  constructor(private router: Router) {
  }

  afterFilterChange() {
    this.filters.page = 0;
    this.updateUrlFilters()
  }

  init(params: ShopFilterParams) {
    console.log(params)

    let colorFilters = params.colors?.split(",")
    if (colorFilters?.length > 0) this.filters.colorFilters = colorFilters.map(i => parseInt(i))

    let flowerTypeFilters = params.flowerTypes?.split(",")
    if (flowerTypeFilters?.length > 0) this.filters.flowerTypeFilters = flowerTypeFilters.map(i => parseInt(i))

    if (params.sort) this.filters.sort = params.sort
    if (params.page) this.filters.page = parseInt(params.page)
    if (params.searchTerm) this.filters.searchTerm = params.searchTerm

    console.log(this.filters)

    this.initialized = true;
  }

  updateUrlFilters() {
    console.log("changeUrlFilters")
    let params: any = {};

    if (this.filters.colorFilters.length > 0) {
      params.colors = this.filters.colorFilters.join(',')
    } else {
      delete params.colors
    }

    if (this.filters.flowerTypeFilters.length > 0) {
      params.flowerTypes = this.filters.flowerTypeFilters.join(',')
    } else {
      delete params.flowerTypes
    }

    if (this.filters.searchTerm) {
      params.searchTerm = this.filters.searchTerm
    } else {
      delete params.searchTerm
    }

    if (this.filters.sort) params.sort = this.filters.sort
    if (this.filters.page) params.page = this.filters.page

    this.router.navigate(['shop'], {queryParams: params})

  }

  showMore() {
    this.filters.page++;
    this.loadingShowMore = true;
    this.updateUrlFilters();
  }



}
