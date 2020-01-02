import { Component } from "@angular/core";
import { BucketLocalService } from "../../../services/bucket-local.service";
import { MatDialogRef } from "@angular/material";
import { SnackBarService } from "../../../services/snak-bar.service";
import { BucketItem } from "../../../models/Bucket";


@Component({
  selector: 'bucket-dialog',
  templateUrl: './bucket-dialog.component.html',
  styleUrls: ['./bucket-dialog.component.scss']
})
export class BucketDialogComponent {


  constructor(public bucketLocalService: BucketLocalService,
              public dialogRef: MatDialogRef<BucketDialogComponent>,
              public snackBarService: SnackBarService){
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


}
