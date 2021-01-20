import { Injectable } from "@angular/core";
import { ShopFilter } from "../api/models/ShopFilter";
import { Pagination } from "../api/models/Pagination";


@Injectable({providedIn: 'root'})
export class ShopCacheService {

  sort
  filters: ShopFilter
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
