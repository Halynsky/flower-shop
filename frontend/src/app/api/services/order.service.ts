import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { RestPage } from "../models/RestPage";
import { OrderAdmin, OrderRequest, OrderStatusChangeRequest } from "../models/Order";

@Injectable({providedIn: 'root'})
export class OrderService {

  private readonly URL = `${API_URL}/orders`;

  constructor(private http: HttpClient) {}

  getAllForAdmin(params, pagination) {
    params = Object.assign(params, ...pagination);
    return this.http.get<RestPage<OrderAdmin>>(`${this.URL}/forAdmin`, {params: params});
  }

  create(orderRequest: OrderRequest) {
    return this.http.post(`${this.URL}`, orderRequest, {responseType: 'text'});
  }

  confirmPayment(id: number) {
    return this.http.put(`${this.URL}/${id}/confirmPayment`, null);
  }

  changeStatus(id: number, orderStatusChangeRequest: OrderStatusChangeRequest) {
    return this.http.put(`${this.URL}/${id}/changeStatus`, orderStatusChangeRequest);
  }

}
