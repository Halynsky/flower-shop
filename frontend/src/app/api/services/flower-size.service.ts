import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { RestPage } from "../models/RestPage";
import { FlowerSize } from "../models/FlowerSize";
import { Pagination } from "../models/Pagination";
import { arrayToHttpParam, copy } from "../../utils/Functions";

@Injectable({providedIn: 'root'})
export class FlowerSizeService {

  private readonly URL = `${API_URL}/flower-sizes`;

  constructor(private  http: HttpClient) {
  }

  getAllForAdmin(params, pagination) {
    params = Object.assign(params, pagination);
    return this.http.get<RestPage<FlowerSize>>(`${this.URL}/forAdmin`, {params: params});
  }

  getAllForAdminAsList() {
    return this.http.get<FlowerSize[]>(`${this.URL}/forAdmin/asList`);
  }

  getByIds(ids: any[]) {
    return this.http.get<FlowerSize[]>(`${this.URL}/byIds`, {params: {ids: ids}});
  }

  getAllForShop(searchTerm: string, paginationObject: Pagination, filtersObject) {
    let filters = copy(filtersObject);
    let pagination = copy(paginationObject);
    for (let key in filters) {
      filters[key] = arrayToHttpParam(filters[key])
    }

    let sort = pagination.sort;
    delete pagination.sort;

    let params = new HttpParams({
      fromObject : {...filters, ...pagination}
    });

    if (sort) {
      let sortParamsAndDirections = sort.split(",");
      let sortParams = [];

      for (let i = 0; i < sortParamsAndDirections.length; i = i + 2) {
        sortParams.push(sortParamsAndDirections[i] + ',' + sortParamsAndDirections[i + 1])
      }
      sortParams.forEach(param => params = params.append('sort', param));
    }

    params = params.append('searchTerm', searchTerm);

    return this.http.get<RestPage<FlowerSize>>(`${this.URL}/shop`, {params: params});
  }

  getForShop(id: number) {
    return this.http.get<FlowerSize>(`${this.URL}/shop/${id}`);
  }

  exportAllToExcel(params, pagination) {
    params = Object.assign(params, pagination);
    return this.http.get(`${this.URL}/export/excel`, {responseType: 'blob', observe: 'response', params: params});
  }

}
