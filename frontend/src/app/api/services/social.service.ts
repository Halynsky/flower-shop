import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { User } from "../models/User";
import { SocialUserInfo } from "../models/SocialUserInfo";

@Injectable({providedIn: 'root'})
export class SocialService {

  private readonly URL = `${API_URL}/social`;

  constructor(private  http: HttpClient) {}

  loginWithFacebook(socialUserInfo: SocialUserInfo) {
    return this.http.post<User>(`${this.URL}/auth/facebook`, socialUserInfo);
  }

  registerWithFacebook(socialUserInfo: SocialUserInfo) {
    return this.http.post<User>(`${this.URL}/register/facebook`, socialUserInfo);
  }

  getConnections() {
    return this.http.get<any[]>(`${this.URL}`);
  }

  connectFacebook(accessToken: string) {
    return this.http.post(`${this.URL}/facebook/connect`, accessToken);
  }

  disconnectFacebook() {
    return this.http.delete(`${this.URL}/facebook/disconnect`, );
  }

}
