import { Injectable } from "@angular/core";
import { BucketInfo, BucketItem } from "../models/Bucket";
import { SecurityService } from "./security.service";
import { BucketService } from "../api/services/bucket.service";
import { FlowerSize } from "../api/models/FlowerSize";
import { FlowerSizeService } from "../api/services/flower-size.service";
import { BucketDialogComponent } from "../components/shared/bucket-dialog/bucket-dialog.component";
import { MatDialog } from "@angular/material/dialog";


@Injectable({providedIn: 'root'})
export class BucketLocalService {
  private readonly BUCKET_STORAGE_KEY = 'bucket';
  public bucketInfo: BucketInfo = new BucketInfo();
  public bucket: BucketItem[];

  constructor(private securityService: SecurityService,
              private bucketService: BucketService,
              private flowerSizeService: FlowerSizeService,
              public dialog: MatDialog) {
    this.bucket = this.getBucket();
    this.updateBucketInfo();
    this.securityService.onLogin.subscribe(() => {
      this.getUserBucket();
    });
  }

  getUserBucket() {
    if(this.bucket.length == 0) {
      this.bucketService.get().subscribe(
        userBucket =>  {
          this.replaceLocalBucket(userBucket)
        }
      )
    } else {
      this.updateBucketBackend(this.bucket);
    }

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
        this.updateBucketBackend(this.bucket);
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
    this.updateBucketFlowerSizes();

  }

  replaceLocalBucket(bucket: BucketItem[]) {

    if (JSON.stringify(bucket) != JSON.stringify(this.getBucket())) {
      localStorage.setItem(this.BUCKET_STORAGE_KEY, JSON.stringify(bucket));
      this.bucket = bucket;
      this.updateBucketInfo(this.bucket);
    }

    this.updateBucketFlowerSizes();

  }

  removeItemFromBucket(bucketItem: BucketItem): BucketItem[] {
    let bucket = this.getBucket();
    bucket = bucket.filter(item => !(item.name == bucketItem.name && item.sizeName == bucketItem.sizeName));
    this.updateBucket(bucket);
    return bucket;
  }

  clearLocalBucket() {
    localStorage.removeItem(this.BUCKET_STORAGE_KEY);
    this.bucket = [];
    this.updateBucketInfo();
  }

  // TODO: return Observable and show loader while updating
  updateBucketFlowerSizes() {
    if (this.bucket.length > 0) {
      this.flowerSizeService.getByIds(this.bucket.map(item => item.flowerSizeId))
        .subscribe(flowerSizes => {
          this.bucket.forEach(bucketItem => {
            let foundFlowerSize: FlowerSize = flowerSizes.find(fs => fs.id == bucketItem.flowerSizeId);
            bucketItem.available = foundFlowerSize.available;
            bucketItem.image = foundFlowerSize.flower.image;
            bucketItem.price = foundFlowerSize.price;
            bucketItem.amount = bucketItem.amount <= foundFlowerSize.available ? bucketItem.amount: foundFlowerSize.available;
          });
          this.updateBucket();
        })
    }
  }

  getMaxAmountForFlowerSize(flowerSizeId, available) {
    let foundBucketItem = this.bucket.find(bucketItem => bucketItem.flowerSizeId == flowerSizeId);
    return foundBucketItem ? available - foundBucketItem.amount : available
  }

  openBucketDialog() {
    this.dialog.open(BucketDialogComponent, {width: "80%", panelClass: "modal-panel-no-padding", maxWidth: 800});
  }

  updateBucketBackend(bucket: BucketItem[] = this.bucket) {
      this.bucketService.post(bucket).subscribe(() => {})
  }

}
