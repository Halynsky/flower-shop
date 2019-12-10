import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Flower, FlowerFull, FlowerShort } from "../models/Flower";
import { arrayToHttpParam, copy } from "../../utils/Functions";
import { API_URL } from "../../utils/Costants";
import { Pagination } from "../models/Pagination";
import { RestPage } from "../models/RestPage";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class FlowerService {

  private readonly URL = `${API_URL}/flowers`;

  constructor(private  http: HttpClient) {}

  getForAdmin(params, pagination) {
    params = Object.assign(params, ...pagination);
    return this.http.get<RestPage<Flower>>(`${this.URL}/forAdmin`, {params: params});
  }

  isNameOriginalFree(name: string): Observable<any> {
    return this.http.get(`${this.URL}/isNameOriginalFree/?name=${name}`, {responseType: 'text'});
  }

  isNameFree(name: string): Observable<any> {
    return this.http.get(`${this.URL}/isNameFree/?name=${name}`, {responseType: 'text'});
  }


  getAll() {
    return this.http.get<Flower[]>(`${this.URL}`);
  }

  getFlowerSizeById(id: number) {
    return this.http.get<FlowerFull>(`${this.URL}/${id}/flowerSizes`);
  }

  getById(id: number) {
    return this.http.get<FlowerFull>(`${this.URL}/${id}`);
  }

  getForShop(searchTerm: string, pagination: Pagination, filtersObject) {
    let filters = copy(filtersObject);
    for (let key in filters) {
      filters[key] = arrayToHttpParam(filters[key])
    }
    let params = {...filters, ...pagination};
    params.searchTerm = searchTerm;

    const httpParams = new HttpParams({fromObject: filters as any});
    return this.http.get<RestPage<FlowerShort>>(`${this.URL}/shop`, {params: params});
  }

  getFlowerFullById(id: number) {
    return this.http.get<FlowerFull>(`${this.URL}/${id}/full`);
  }

  create(flower: Flower) {
    return this.http.post(`${this.URL}`, flower);
  }

  update(id: number, flower: Flower) {
    return this.http.put(`${this.URL}/${id}`, flower);
  }

  delete(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }


}
