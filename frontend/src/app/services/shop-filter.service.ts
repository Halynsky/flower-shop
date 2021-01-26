import { Injectable } from "@angular/core";
import { ShopFilter } from "../api/models/ShopFilter";


@Injectable({providedIn: 'root'})
export class ShopFilterService {

  params = new ShopFilter();

}
