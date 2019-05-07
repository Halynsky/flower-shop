import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Flower } from "../models/Flower";

@Injectable({providedIn: 'root'})
export class FlowerService {

  constructor(private  http: HttpClient) {}

  getAll() {
    return this.http.get<Flower[]>("api/flowers");
  }

  getById(id: number) {
    return this.http.get<Flower>(`api/flowers/${id}`);
  }

}
