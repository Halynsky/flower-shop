import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { BucketItem } from "../../models/Bucket";

@Injectable({providedIn: 'root'})
export class OrderService {

  private readonly URL = `${API_URL}/orders`;

  constructor(private http: HttpClient) {}

  create(bucketItems: BucketItem[]) {
    return this.http.post(`${this.URL}`, bucketItems);
  }

}

