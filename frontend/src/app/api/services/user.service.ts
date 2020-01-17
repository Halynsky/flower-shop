import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { RestPage } from "../models/RestPage";
import { Pagination } from "../models/Pagination";
import { API_URL } from "../../utils/Costants";
import { UserForAdmin } from "../models/User";
import { Observable } from "rxjs";

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

  create(user: UserForAdmin) {
    return this.http.post(`${this.URL}`, user);
  }

  update(id: number, user: UserForAdmin) {
    return this.http.put(`${this.URL}/${id}`, user);
  }

  updateDisabled(id: number, disabled: boolean) {
    return this.http.delete(`${this.URL}/${id}/disabled/?disabled=${disabled}`);
  }

  isEmailFree(email: string): Observable<any> {
    return this.http.get(`${this.URL}/isEmailFree/?email=${email}`, {responseType: 'text'});
  }

  merge(id: number, mergingUserId: any) {
    return this.http.put(`${this.URL}/${id}/merge`, mergingUserId);
  }

  changeNote(id: number, userNote: any) {
    return this.http.put(`${this.URL}/${id}/changeNote`, userNote);
  }

}
