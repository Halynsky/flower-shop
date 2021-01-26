import { Injectable } from "@angular/core";
import { ShopFilters } from "../api/models/ShopFilters";
import { Pagination } from "../api/models/Pagination";


@Injectable({providedIn: 'root'})
export class ShopCacheService {

  sort
  filters: ShopFilters
  searchTerm
  pagination: Pagination
  cachedData

  constructor() {
  }

  reset() {
    this.sort = null
    this.filters = null
    this.searchTerm = null
    this.pagination = null
    this.cachedData = null
  }

}
