import { Component } from "@angular/core";
import { BucketLocalService } from "../../../../services/bucket-local.service";
import { MatDialogRef } from "@angular/material";
import { OrderService } from "../../../../api/services/order.service";
import { SnackBarService } from "../../../../services/snak-bar.service";


@Component({
  selector: 'bucket-dialog',
  templateUrl: './bucket-dialog.component.html',
  styleUrls: ['./bucket-dialog.component.scss']
})
export class BucketDialogComponent {


  constructor(public bucketLocalService: BucketLocalService,
              public dialogRef: MatDialogRef<BucketDialogComponent>,
              public orderService: OrderService,
              public snackBarService: SnackBarService){

  }

  onBucketChange() {
    this.bucketLocalService.updateBucket();
  }


}
