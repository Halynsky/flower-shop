import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Flower, FlowerFull, FlowerShort } from "../models/Flower";
import { arrayToHttpParam, copy } from "../../utils/Functions";
import { API_URL } from "../../utils/Costants";
import { Pagination } from "../models/Pagination";
import { RestPage } from "../models/RestPage";

@Injectable({providedIn: 'root'})
export class FlowerService {

  private readonly URL = `${API_URL}/flowers`;

  constructor(private  http: HttpClient) {}

  getAllForAdmin(params, pagination) {
    params = Object.assign(params, ...pagination);
    return this.http.get<RestPage<Flower>>(`${this.URL}/forAdmin`, {params: params});
  }

  getAll() {
    return this.http.get<Flower[]>(`${this.URL}`);
  }

  getForSelector() {
    return this.http.get<Flower[]>(`${this.URL}/forSelector`);
  }

  getFlowerSizesById(id: number) {
    return this.http.get<FlowerFull>(`${this.URL}/${id}/flowerSizes`);
  }

  getById(id: number) {
    return this.http.get<FlowerFull>(`${this.URL}/${id}`);
  }

  getForShop(searchTerm: string, paginationObject: Pagination, filtersObject) {
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

    return this.http.get<RestPage<FlowerShort>>(`${this.URL}/shop`, {params: params});
  }

  getFlowerFullById(id: number) {
    return this.http.get<FlowerFull>(`${this.URL}/${id}/full`);
  }

  create(flower: FormData) {
    return this.http.post(`${this.URL}`, flower);
  }

  update(id: number, flower: FormData) {
    return this.http.put(`${this.URL}/${id}`, flower);
  }

  delete(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }


}
