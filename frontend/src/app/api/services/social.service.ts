import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { User, UserRegistration } from "../models/User";
import { Credentials } from "../models/Credentials";
import { Observable } from "rxjs";
import { SocialUser } from "angularx-social-login";

@Injectable({providedIn: 'root'})
export class SocialService {

  private readonly URL = `${API_URL}/social`;

  constructor(private  http: HttpClient) {}

  loginOrRegisterWithFacebook(authToken: String) {
    return this.http.post<User>(`${this.URL}/auth/facebook`, authToken);
  }


}
