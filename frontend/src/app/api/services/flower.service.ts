import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Flower, FlowerFull, FlowerShort } from "../models/Flower";
import { arrayToHttpParam, copy } from "../../utils/Functions";
import { API_URL } from "../../utils/Costants";

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

  getForShop(filtersObject) {
    let filters = copy(filtersObject);
    for (let key in filters) {
      filters[key] = arrayToHttpParam(filters[key])
    }
    console.log(filters);
    const params = new HttpParams({fromObject: filters as any});
    console.log(params);
    return this.http.get<FlowerShort[]>(`${this.URL}/shop`, {params});
  }

  getFlowerFullById(id: number) {
    return this.http.get<FlowerFull>(`${this.URL}/${id}/full`);
  }
}
