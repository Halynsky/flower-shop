import { Injectable } from "@angular/core";
import { BucketItem } from "../models/BucketItem";


@Injectable({providedIn: 'root'})
export class BucketService {
  private readonly BUCKET_STORAGE_KEY = 'bucket';
  private items: BucketItem[] = [];


  addPurchase(bucketItem: BucketItem) {
    let bucket = this.getBucket();
    let isPresent = false;
    if (bucket.length > 0) {
      bucket.forEach((item) => {
        if (bucketItem.name == item.name && bucketItem.size == item.size) {
          item.amount += bucketItem.amount;
          isPresent = true;
        }
      });
      if (!isPresent)
        bucket.push(bucketItem);
    } else {
      bucket.push(bucketItem);
    }
    this.updateBucket(bucket);
  }

  updateBucketItem(bucketItem, bool) {
    let bucket = this.getBucket();
    bool = null;
    let itemToUpdate = bucket.find((item) => {return item.name == bucketItem.name && item.size == bucketItem.size});
    if (bool){
      itemToUpdate.amount++;
    } else {
      itemToUpdate--;
    }
    this.updateBucket(bucket);
  }

  deleteItem(bucketItem) {
    let bucket = this.getBucket();
    let index = bucket.indexOf(bucketItem);
    bucket.splice(index,1);
    this.updateBucket(bucket);
  }

  getBucket() {
    const storageBucket = localStorage.getItem(this.BUCKET_STORAGE_KEY);
    let bucket;
    try {
      bucket = JSON.parse(storageBucket)
    } catch (e) {
      bucket = []
    }
    return bucket ? bucket : [];
  }

  clearBucket() {
    localStorage.removeItem(this.BUCKET_STORAGE_KEY);
  }

  private updateBucket(items) {
    localStorage.setItem(this.BUCKET_STORAGE_KEY, JSON.stringify(items));
  }




}
