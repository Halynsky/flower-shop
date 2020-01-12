import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { RestPage } from "../models/RestPage";
import { FlowerSize } from "../models/FlowerSize";

@Injectable({providedIn: 'root'})
export class FlowerSizeService {

  private readonly URL = `${API_URL}/flower-sizes`;

  constructor(private  http: HttpClient) {
  }

  getAllForAdmin(params, pagination) {
    params = Object.assign(params, ...pagination);
    return this.http.get<RestPage<FlowerSize>>(`${this.URL}/forAdmin`, {params: params});
  }

  getAllForAdminAsList() {
    return this.http.get<FlowerSize[]>(`${this.URL}/forAdmin/asList`);
  }

  getByIds(ids: any[]) {
    return this.http.get<FlowerSize[]>(`${this.URL}/byIds`, {params: {ids: ids}});
  }

}
