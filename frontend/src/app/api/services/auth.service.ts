import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { User, UserRegistration } from "../models/User";
import { Credentials } from "../models/Credentials";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthService {

  private readonly URL = `${API_URL}/auth`;

  constructor(private  http: HttpClient) {}

  login(credentials: Credentials) {
    return this.http.post<User>(`${this.URL}/login`, credentials);
  }

  logot() {
    return this.http.post(`${this.URL}/logout`, {responseType: 'text'});
  }

  register(user: UserRegistration): Observable<any> {
    return this.http.post(`${this.URL}/register`, user);
  }

}
