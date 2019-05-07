import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Size } from "../models/Size";

@Injectable({providedIn: 'root'})
export class SizeService {

  constructor(private  http: HttpClient) {}

  getAll() {
    return this.http.get<Size[]>("api/sizes");
  }

  getById(id: number) {
    return this.http.get<Size>(`api/sizes/${id}`);
  }

}
