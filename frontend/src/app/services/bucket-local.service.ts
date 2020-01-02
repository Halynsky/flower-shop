import { Injectable } from "@angular/core";
import { BucketInfo, BucketItem } from "../models/Bucket";
import { SecurityService } from "./security.service";
import { BucketService } from "../api/services/bucket.service";


@Injectable({providedIn: 'root'})
export class BucketLocalService {
  private readonly BUCKET_STORAGE_KEY = 'bucket';
  public bucketInfo: BucketInfo = new BucketInfo();
  public bucket: BucketItem[];

  constructor(private securityService: SecurityService,
              private bucketService: BucketService) {
    this.bucket = this.getBucket();
    this.updateBucketInfo();
    this.securityService.onLogin.subscribe(() => {
      this.getUserBucket();
    });
    // this.securityService.onLogout.subscribe(() => {
    //   this.updateBucketInfo();
    // });
  }

  getUserBucket() {
    this.bucketService.get().subscribe(
      userBucket => this.addToBucket(userBucket)
    )
  }

  updateBucketInfo(bucket: BucketItem[] = this.getBucket()) {
    this.bucketInfo.totalItems = 0;
    this.bucketInfo.totalAmount = 0;
    this.bucketInfo.totalPrice = 0;
    bucket.forEach( item => {
      this.bucketInfo.totalItems++;
      this.bucketInfo.totalAmount += item.amount;
      this.bucketInfo.totalPrice += item.price * item.amount;
    });
  }

  private getBucket() {
    const storageBucket = localStorage.getItem(this.BUCKET_STORAGE_KEY);
    let bucket;
    try {
      bucket = JSON.parse(storageBucket)
    } catch (e) {
      bucket = []
    }
    return bucket ? bucket : [];
  }

  updateBucket(bucket: BucketItem[] = this.bucket) {
    if (JSON.stringify(bucket) != JSON.stringify(this.getBucket())) {
      localStorage.setItem(this.BUCKET_STORAGE_KEY, JSON.stringify(bucket));
      this.bucket = bucket;
      this.updateBucketInfo(this.bucket);
      if(this.securityService.isAuthenticated()) {
        this.bucketService.post(this.bucket).subscribe(() => {})
      }
    }
  }

  addToBucket(bucketItems: BucketItem[]) {
    let bucket = this.getBucket();

    bucketItems.forEach(item => {
      let index = bucket.findIndex(element => element.flowerSizeId == item.flowerSizeId);
      if (index >= 0) {
        bucket[index].amount = parseInt(bucket[index].amount) + parseInt(item.amount as any);
        bucket[index].image = item.image;
      } else {
        bucket.push(item)
      }
    });

    this.updateBucket(bucket);

  }

  removeItemFromBucket(bucketItem: BucketItem): BucketItem[] {
    let bucket = this.getBucket();
    bucket = bucket.filter(item => !(item.name == bucketItem.name && item.sizeName == bucketItem.sizeName));
    this.updateBucket(bucket);
    return bucket;
  }

  clearBucket() {
    localStorage.removeItem(this.BUCKET_STORAGE_KEY);
    this.bucket = [];
    this.updateBucketInfo();
  }

}
