import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { RestPage } from "../models/RestPage";
import { Order, OrderRequest } from "../models/Order";

@Injectable({providedIn: 'root'})
export class OrderService {

  private readonly URL = `${API_URL}/orders`;

  constructor(private http: HttpClient) {}

  getAllForAdmin(params, pagination) {
    params = Object.assign(params, ...pagination);
    return this.http.get<RestPage<Order>>(`${this.URL}/forAdmin`, {params: params});
  }

  create(orderRequest: OrderRequest) {
    return this.http.post(`${this.URL}`, orderRequest, {responseType: 'text'});
  }

}

