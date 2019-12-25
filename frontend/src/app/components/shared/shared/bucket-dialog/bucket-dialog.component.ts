import { Component } from "@angular/core";
import { BucketService } from "../../../../services/bucket.service";
import { MatDialogRef } from "@angular/material";


@Component({
  selector: 'bucket-dialog',
  templateUrl: './bucket-dialog.component.html',
  styleUrls: ['./bucket-dialog.component.scss']
})
export class BucketDialogComponent {


  constructor(public bucketService: BucketService,
              public dialogRef: MatDialogRef<BucketDialogComponent>){

  }


}
