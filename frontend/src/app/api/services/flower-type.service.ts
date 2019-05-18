import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FlowerType } from "../models/FlowerType";
import { API_URL } from "../../utils/Costants";

@Injectable({providedIn: 'root'})
export class FlowerTypeService {

  private readonly URL = `${API_URL}/flowerTypes`;

  constructor(private  http: HttpClient) {}

  getAll() {
    return this.http.get<FlowerType[]>(`${this.URL}`)
  }

  getById(id: number) {
    return this.http.get<FlowerType>(`${this.URL}/${id}`);
  }

}
