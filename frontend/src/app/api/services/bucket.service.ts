import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { BucketItem } from "../../models/Bucket";

@Injectable({providedIn: 'root'})
export class BucketService {

  private readonly URL = `${API_URL}/buckets`;

  constructor(private http: HttpClient) {}

  post(bucketItems: BucketItem[]) {
    return this.http.post(`${this.URL}`, bucketItems);
  }

}

