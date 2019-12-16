import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { PasswordUpdate, Profile } from "../models/Profile";

@Injectable({providedIn: 'root'})
export class ProfileService {

  private readonly URL = `${API_URL}/profile`;

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<Profile>(`${this.URL}`);
  }

  update(profile: Profile) {
    return this.http.put(`${this.URL}`, profile);
  }

  updatePassword(passwordUpdate: PasswordUpdate) {
    return this.http.put(`${this.URL}/password`, passwordUpdate);
  }
}

