import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class NovaPoshtaService {

  private readonly URL = `https://api.novaposhta.ua/v2.0/json`;
  private readonly SEARCH_SETTLEMENTS_URL = `/Address/searchSettlements/`;
  private readonly GET_WAREHOUSES_URL = `/AddressGeneral/getWarehouses`;

  constructor(private  http: HttpClient) {}

  getCitiesByName(namePart: string) {

    let request = {
      modelName: "Address",
      calledMethod: "searchSettlements",
      methodProperties: {
        CityName: namePart,
        Limit: 5
      },
      apiKey: environment.novaPoshtaApiKey,
    };

    return this.http.post<any>(`${this.URL}${this.SEARCH_SETTLEMENTS_URL}`, request);

  }

  getWarehousesByCityRef(settlementRef: string) {

    let request = {
      modelName: "AddressGeneral",
      calledMethod: "getWarehouses",
      methodProperties: {
        Language: "ua",
        SettlementRef: settlementRef
      },
      apiKey: environment.novaPoshtaApiKey,
    };

    return this.http.post<any>(`${this.URL}${this.GET_WAREHOUSES_URL}`, request);

  }



}
