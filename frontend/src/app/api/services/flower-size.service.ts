import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FlowerType } from "../models/FlowerType";
import { API_URL } from "../../utils/Costants";
import { Observable } from "rxjs";
import { RestPage } from "../models/RestPage";
import { Flower } from "../models/Flower";
import { FlowerSize } from "../models/FlowerSize";

@Injectable({providedIn: 'root'})
export class FlowerSizeService {

  private readonly URL = `${API_URL}/flower-sizes`;

  constructor(private  http: HttpClient) {}

  getAllForAdmin(params, pagination) {
    params = Object.assign(params, ...pagination);
    return this.http.get<RestPage<FlowerSize>>(`${this.URL}/forAdmin`, {params: params});
  }

}
