import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Article } from "../models/Article";
import { RestPage } from "../models/RestPage";
import { Pagination } from "../models/Pagination";
import { API_URL } from "../../utils/Costants";
import { UserForAdmin } from "../models/User";
import { Flower } from "../models/Flower";

@Injectable({providedIn: 'root'})
export class UserService {

  private readonly URL = `${API_URL}/users`;

  constructor(private http: HttpClient) {}

  getForAdmin(params, pagination) {
    params = Object.assign(params, ...pagination);
    return this.http.get<RestPage<UserForAdmin>>(`${this.URL}/forAdmin`, {params: params});
  }

  getAll(pagination: Pagination) {
    const params = new HttpParams({fromObject: pagination as any});
    return this.http.get<RestPage<UserForAdmin>>(`${this.URL}`, {params})
  }

  getById(id: number) {
    return this.http.get<UserForAdmin>(`${this.URL}/${id}`);
  }

  delete(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }


}
