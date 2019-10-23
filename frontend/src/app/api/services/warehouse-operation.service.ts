import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { RestPage } from "../models/RestPage";
import { WarehouseOperation } from "../models/WarehouseOperation";

@Injectable({providedIn: 'root'})
export class WarehouseOperationService {

  private readonly URL = `${API_URL}/warehouse-operations`;

  constructor(private  http: HttpClient) {}

  getAll(params, pagination) {
    params = Object.assign(params, ...pagination);
    return this.http.get<RestPage<WarehouseOperation>>(`${this.URL}`, {params: params});
  }

  getById(id: number) {
    return this.http.get<WarehouseOperation>(`${this.URL}/${id}`);
  }

  add(warehouseOperation: WarehouseOperation) {
    return this.http.post(`${this.URL}`, warehouseOperation);
  }

  update(id: number, warehouseOperation: WarehouseOperation) {
    return this.http.put(`${this.URL}/${id}`, warehouseOperation);
  }

  delete(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }


}
