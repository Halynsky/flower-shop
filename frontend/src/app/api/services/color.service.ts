import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Color } from "colors";
import { API_URL } from "../../utils/Costants";

@Injectable({providedIn: 'root'})
export class ColorService {

  private readonly URL = `${API_URL}/colors`;

  constructor(private  http: HttpClient) {}

  getAll() {
    return this.http.get<Color[]>(`${this.URL}`);
  }

  getById(id: number) {
    return this.http.get<Color>(`${this.URL}/${id}`);
  }

}
