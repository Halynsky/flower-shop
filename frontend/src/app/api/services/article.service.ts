import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Article } from "../models/Article";
import { RestPage } from "../models/RestPage";
import { Pagination } from "../models/Pagination";

@Injectable({providedIn: 'root'})
export class ArticleService {

  constructor(private  http: HttpClient) {}

  getAll(pagination: Pagination) {
    const params = {...pagination} as HttpParams;
    return this.http.get<RestPage<Article>>("api/articles", {params})
  }

}
