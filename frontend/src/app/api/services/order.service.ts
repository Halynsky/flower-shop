import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { RestPage } from "../models/RestPage";
import { Order, OrderAdmin, OrderContactsChangeRequest, OrderRequest, OrderStatusChangeRequest } from "../models/Order";
import { IdAmountTuple } from "../models/IdAmountTuple";

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

  confirmPayment(id: number, date) {
    return this.http.put(`${this.URL}/${id}/confirmPayment`, date);
  }

  changeStatus(id: number, orderStatusChangeRequest: OrderStatusChangeRequest) {
    return this.http.put(`${this.URL}/${id}/changeStatus`, orderStatusChangeRequest);
  }

  changeContacts(id: number, orderContactsChangeRequest: OrderContactsChangeRequest) {
    return this.http.put(`${this.URL}/${id}/changeContacts`, orderContactsChangeRequest);
  }

  changeNote(id: number, orderNote: any) {
    return this.http.put(`${this.URL}/${id}/changeNote`, orderNote);
  }

  merge(id: number, mergingOrderId: any) {
    return this.http.put(`${this.URL}/${id}/merge`, mergingOrderId);
  }

  split(id: number, orderItemIds: number[]) {
    return this.http.put(`${this.URL}/${id}/split`, orderItemIds);
  }

  updateOrderItems(id: number, orderItems: IdAmountTuple[]) {
    return this.http.put(`${this.URL}/${id}/items`, orderItems);
  }

  changeDiscount(id: number, orderDiscount: number) {
    return this.http.put(`${this.URL}/${id}/discount`, orderDiscount);
  }

  getMyOrders(pagination) {
    return this.http.get<RestPage<Order>>(`${this.URL}/my`, {params: pagination});
  }

}
