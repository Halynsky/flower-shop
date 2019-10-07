import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Color } from "colors";
import { API_URL } from "../../utils/Costants";
import { Size } from "../models/Size";
import { ColorAdmin } from "../models/Color";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class ColorService {

  private readonly URL = `${API_URL}/colors`;

  constructor(private  http: HttpClient) {}

  getForAdmin() {
    return this.http.get<ColorAdmin[]>(`${this.URL}/forAdmin`);
  }

  isNameFree(name: string): Observable<any> {
    return this.http.get(`${this.URL}/isNameFree/?name=${name}`, {responseType: 'text'});
  }

  isHexFree(hex: string): Observable<any> {
    const params = new HttpParams().set('hex', hex)
    return this.http.get(`${this.URL}/isColorFree`, {params: params});
  }

  getAll() {
    return this.http.get<Color[]>(`${this.URL}`);
  }

  getById(id: number) {
    return this.http.get<Color>(`${this.URL}/${id}`);
  }

  add(color: Color) {
    return this.http.post(`${this.URL}`, color);
  }

  update(id: number, color: Color) {
    return this.http.put(`${this.URL}/${id}`, color);
  }

  delete(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }

}
