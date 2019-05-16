import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Flower } from "../models/Flower";
import { arrayToHttpParam, copy } from "../../utils/Functions";

@Injectable({providedIn: 'root'})
export class FlowerService {

  constructor(private  http: HttpClient) {}

  getAll() {
    return this.http.get<Flower[]>("api/flowers");
  }

  getById(id: number) {
    return this.http.get<Flower>(`api/flowers/${id}`);
  }

  getForShop(filtersObject) {
    let filters = copy(filtersObject);
    for (let key in filters) {
      filters[key] =  arrayToHttpParam(filters[key])
    }
    const params = new HttpParams({fromObject: filters as any});
    return this.http.get<Flower[]>(`api/flowers/shop`, {params});
  }

}
