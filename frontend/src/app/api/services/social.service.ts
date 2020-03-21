import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { User } from "../models/User";

@Injectable({providedIn: 'root'})
export class SocialService {

  private readonly URL = `${API_URL}/social`;

  constructor(private  http: HttpClient) {}

  loginOrRegisterWithFacebook(user) {
    let userTokenEmail = {
      accessToken: user.authToken,
      email: user.email
    }
    return this.http.post<User>(`${this.URL}/auth/facebook`, userTokenEmail);
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

  existsByProviderId(providerId: string) {
    return this.http.get<string>(`${this.URL}/${providerId}/existsByProviderId`);
  }

}
