import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { RestPage } from "../models/RestPage";
import { WarehouseOperation } from "../models/WarehouseOperation";
import { WarehouseOperationType } from "../models/WarehouseOperationType";
import OperationType = WarehouseOperationType.OperationType;

@Injectable({providedIn: 'root'})
export class WarehouseOperationService {

  private readonly URL = `${API_URL}/warehouse-operations`;

  constructor(private  http: HttpClient) {}

  getAll(params, pagination) {
    params = Object.assign(params, pagination);
    return this.http.get<RestPage<WarehouseOperation>>(`${this.URL}`, {params: params});
  }

  getById(id: number) {
    return this.http.get<WarehouseOperation>(`${this.URL}/${id}`);
  }

  getWarehouseOperationType(operationType: OperationType) {
    return this.http.get<WarehouseOperationType>(`${this.URL}/byWarehouseOperationType/?operationType=${operationType}`)
  }

  add(warehouseOperation: WarehouseOperation) {
    return this.http.post(`${this.URL}`, warehouseOperation);
  }

  delete(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }


}
