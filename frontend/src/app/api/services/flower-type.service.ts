import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FlowerType, FlowerTypeImageNameTupleWithAvailable } from "../models/FlowerType";
import { API_URL } from "../../utils/Costants";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class FlowerTypeService {

  private readonly URL = `${API_URL}/flower-types`;

  constructor(private  http: HttpClient) {}

  getAll() {
    return this.http.get<FlowerType[]>(`${this.URL}`)
  }

  getAllWithImage() {
    return this.http.get<FlowerTypeImageNameTupleWithAvailable[]>(`${this.URL}/imageNameTuple`)
  }

  isNameFree(name: string): Observable<any> {
    return this.http.get(`${this.URL}/isNameFree/?name=${name}`, {responseType: 'text'});
  }

  getById(id: number) {
    return this.http.get<FlowerType>(`${this.URL}/${id}`);
  }

  create(flowerType: FormData) {
    return this.http.post(`${this.URL}`, flowerType);
  }

  update(id: number, flowerType: FormData) {
    return this.http.put(`${this.URL}/${id}`, flowerType);
  }

  updateDescription(id, description: string) {
    return this.http.put(`${this.URL}/${id}/description`, description);
  }

  delete(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }

}
