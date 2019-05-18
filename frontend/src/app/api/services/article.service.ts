import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Article } from "../models/Article";
import { RestPage } from "../models/RestPage";
import { Pagination } from "../models/Pagination";
import { API_URL } from "../../utils/Costants";

@Injectable({providedIn: 'root'})
export class ArticleService {

  private readonly URL = `${API_URL}/articles`;

  constructor(private  http: HttpClient) {}

  getAll(pagination: Pagination) {
    const params = new HttpParams({fromObject: pagination as any});
    return this.http.get<RestPage<Article>>(`${this.URL}`, {params})
  }

  getById(id: number) {
    return this.http.get<Article>(`${this.URL}/${id}`);
  }

}
