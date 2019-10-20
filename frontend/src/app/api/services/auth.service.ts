import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";

@Injectable({providedIn: 'root'})
export class AuthService {

  private readonly URL = `${API_URL}/auth`;

  constructor(private  http: HttpClient) {}

  login(email, password) {

    const authData = {
      email: email,
      password: password
    };

    return this.http.post(`${this.URL}/login`, authData);
  }

  logot() {
    return this.http.post(`${this.URL}/logout`, {responseType: 'text'});
  }

}
