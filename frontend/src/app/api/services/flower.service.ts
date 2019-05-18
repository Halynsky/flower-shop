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
    return this.http.get<Flower[]>(`${API_URL}`);
  }

  getById(id: number) {
    return this.http.get<Flower>(`${API_URL}/${id}`);
  }

  getForShop(filtersObject) {
    let filters = copy(filtersObject);
    for (let key in filters) {
      filters[key] =  arrayToHttpParam(filters[key])
    }
    const params = new HttpParams({fromObject: filters as any});
    return this.http.get<FlowerShort[]>(`${API_URL}/shop`, {params});
  }

  getFlowerFullById(id: number) {
    return this.http.get<FlowerFull>(`api/flowers/${id}/full`);
  }
}
