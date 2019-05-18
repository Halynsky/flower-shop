import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Size, SizeAdmin } from "../models/Size";
import { API_URL } from "../../utils/Costants";

@Injectable({providedIn: 'root'})
export class SizeService {

  private readonly URL = `${API_URL}/sizes`;

  constructor(private  http: HttpClient) {}

  getForAdmin() {
    return this.http.get<SizeAdmin[]>(`${this.URL}/forAdmin`);
  }


  getAll() {
    return this.http.get<Size[]>(`${this.URL}`);
  }

  getById(id: number) {
    return this.http.get<Size>(`${this.URL}/${id}`);
  }

}
