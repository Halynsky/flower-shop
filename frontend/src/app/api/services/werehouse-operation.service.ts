import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Flower, FlowerFull, FlowerShort } from "../models/Flower";
import { arrayToHttpParam, copy } from "../../utils/Functions";
import { API_URL } from "../../utils/Costants";
import { Pagination } from "../models/Pagination";
import { RestPage } from "../models/RestPage";
import { WerehouseOperation } from "../models/WerehouseOperation";

@Injectable({providedIn: 'root'})
export class WerehouseOperationService {

  private readonly URL = `${API_URL}/werehouseOperations`;

  constructor(private  http: HttpClient) {}

  getAll() {
    return this.http.get<WerehouseOperation[]>(`${this.URL}`);
  }

  getById(id: number) {
    return this.http.get<WerehouseOperation>(`${this.URL}/${id}`);
  }

  add(werehouseOperation: WerehouseOperation) {
    return this.http.post(`${this.URL}`, werehouseOperation);
  }

  update(id: number, werehouseOperation: WerehouseOperation) {
    return this.http.put(`${this.URL}/${id}`, werehouseOperation);
  }

  delete(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }


}
