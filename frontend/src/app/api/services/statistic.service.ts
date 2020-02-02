import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { Statistic } from "../models/Statistic";

@Injectable({providedIn: 'root'})
export class StatisticService {

  private readonly URL = `${API_URL}/statistic`;

  constructor(private http: HttpClient) {}

  getUserRegistrationStatisticStructural() {
    return this.http.get<Array<Statistic>>(`${this.URL}/users/registration/structural`, );
  }

  getUsersRegistrationStatisticDynamical(period: Statistic.Period = Statistic.Period.MONTH) {
    const params = new HttpParams().append('period', period);
    return this.http.get<Array<Statistic>>(`${this.URL}/users/registration/dynamical`, {params});
  }


}
