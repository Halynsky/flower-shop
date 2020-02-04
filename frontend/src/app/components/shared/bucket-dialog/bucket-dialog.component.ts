import { Component, OnInit } from "@angular/core";
import { BucketLocalService } from "../../../services/bucket-local.service";
import { MatDialogRef } from "@angular/material";
import { SnackBarService } from "../../../services/snak-bar.service";
import { BucketItem } from "../../../models/Bucket";
import { FlowerSizeService } from "../../../api/services/flower-size.service";
import { FLOWER_PLACEHOLDER } from "../../../utils/Costants";


@Component({
  selector: 'bucket-dialog',
  templateUrl: './bucket-dialog.component.html',
  styleUrls: ['./bucket-dialog.component.scss']
})
export class BucketDialogComponent implements OnInit {

  placeholderPhoto = FLOWER_PLACEHOLDER;

  constructor(public bucketLocalService: BucketLocalService,
              public dialogRef: MatDialogRef<BucketDialogComponent>,
              public snackBarService: SnackBarService,
              public flowerSizeService: FlowerSizeService){
  }

  onBucketChange() {
    this.bucketLocalService.updateBucket();
  }

  removeBucketItem(bucketItem: BucketItem) {
    let bucket = this.bucketLocalService.removeItemFromBucket(bucketItem);
    if (bucket.length <= 0) {
      this.dialogRef.close()
    }
  }

  ngOnInit() {
    this.bucketLocalService.updateBucketFlowerSizes()
  }


}
