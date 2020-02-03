import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { Statistic } from "../models/Statistic";

@Injectable({providedIn: 'root'})
export class StatisticService {

  private readonly URL = `${API_URL}/statistic`;

  constructor(private http: HttpClient) {}

  getUsersRegistrationStatisticStructural() {
    return this.http.get<Array<Statistic>>(`${this.URL}/users/registration/structural`);
  }

  getUsersRegistrationStatisticDynamical(period: Statistic.Period = Statistic.Period.MONTH) {
    const params = new HttpParams().append('period', period);
    return this.http.get<Array<Statistic>>(`${this.URL}/users/registration/dynamical`, {params});
  }

  getOrderByStatusCountStatisticStructural(period: Statistic.Period = Statistic.Period.MONTH) {
    const params = new HttpParams().append('period', period);
    return this.http.get<Array<Statistic>>(`${this.URL}/orders/byStatus/count/structural`, {params});
  }

  getOrderByStatusCountStatisticDynamical(period: Statistic.Period = Statistic.Period.MONTH) {
    const params = new HttpParams().append('period', period);
    return this.http.get<Array<Statistic>>(`${this.URL}/orders/byStatus/count/dynamical`, {params});
  }

  getOrderByPaidCountStatisticStructural(period: Statistic.Period = Statistic.Period.MONTH) {
    const params = new HttpParams().append('period', period);
    return this.http.get<Array<Statistic>>(`${this.URL}/orders/byPaid/count/structural`, {params});
  }

  getOrderByPaidAmountStatisticStructural(period: Statistic.Period = Statistic.Period.MONTH) {
    const params = new HttpParams().append('period', period);
    return this.http.get<Array<Statistic>>(`${this.URL}/orders/byPaid/amount/structural`, {params});
  }

  getWarehouseItemsAmountStatisticStructural(period: Statistic.Period = Statistic.Period.MONTH) {
    const params = new HttpParams().append('period', period);
    return this.http.get<Array<Statistic>>(`${this.URL}/warehouse/count/structural`, {params});
  }

  getWarehouseItemsPriceStatisticStructural(period: Statistic.Period = Statistic.Period.MONTH) {
    const params = new HttpParams().append('period', period);
    return this.http.get<Array<Statistic>>(`${this.URL}/warehouse/price/structural`, {params});
  }


}
