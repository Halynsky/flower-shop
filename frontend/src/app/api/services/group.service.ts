import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { Group, GroupAdmin } from "../models/Group";

@Injectable({providedIn: 'root'})
export class GroupService {

  private readonly URL = `${API_URL}/groups`;

  constructor(private  http: HttpClient) {}

  getForAdmin() {
    return this.http.get<GroupAdmin[]>(`${this.URL}/forAdmin`);
  }

  getAll() {
    return this.http.get<Group[]>(`${this.URL}`);
  }

  getById(id: number) {
    return this.http.get<GroupAdmin>(`${this.URL}/${id}`);
  }

  getByFlowerTypeId(flowerTypeId: number) {
    return this.http.get<Group[]>(`${this.URL}/byFlowerType/${flowerTypeId}`);
  }

  add(group: GroupAdmin) {
    return this.http.post(`${this.URL}`, group);
  }

  update(id: number, group: GroupAdmin) {
    return this.http.put(`${this.URL}/${id}`, group);
  }

  delete(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }

}
