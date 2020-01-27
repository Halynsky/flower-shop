import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { User, UserRegistration } from "../models/User";
import { Credentials } from "../models/Credentials";
import { Observable } from "rxjs";
import { PasswordRestoreConfirm } from "../models/PasswordRestoreConfirm";

@Injectable({providedIn: 'root'})
export class AuthService {

  private readonly URL = `${API_URL}/auth`;

  constructor(private  http: HttpClient) {}

  login(credentials: Credentials) {
    return this.http.post<User>(`${this.URL}/login`, credentials);
  }

  logout() {
    return this.http.post(`${this.URL}/logout`, {responseType: 'text'});
  }

  register(user: UserRegistration): Observable<any> {
    return this.http.post(`${this.URL}/register`, user);
  }

  activate(secretKey: string): Observable<any> {
    return this.http.post(`${this.URL}/activate`, secretKey);
  }

  passwordRestoreRequest(email: string) {
    return this.http.post(`${this.URL}/password/restore/request`, email);
  }

  passwordRestoreConfirm(passwordRestoreConfirm: PasswordRestoreConfirm) {
    return this.http.post(`${this.URL}/password/restore/confirm`, passwordRestoreConfirm);
  }

}
