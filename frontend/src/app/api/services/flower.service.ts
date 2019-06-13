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

  getForAdmin() {
    return this.http.get<Flower[]>(`${this.URL}/forAdmin`);
  }

  getAll() {
    return this.http.get<Flower[]>(`${this.URL}`);
  }

  getById(id: number) {
    return this.http.get<Flower>(`${this.URL}/${id}`);
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
}
