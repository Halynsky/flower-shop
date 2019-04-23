import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FlowerType } from "../models/FlowerType";

@Injectable({providedIn: 'root'})
export class FlowerTypeService {

  constructor(private  http: HttpClient) {}

  getAll() {
    return this.http.get<FlowerType[]>("api/flowerTypes")
  }

}
