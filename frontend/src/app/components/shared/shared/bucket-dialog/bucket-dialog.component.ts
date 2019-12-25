import { Component } from "@angular/core";
import { BucketService } from "../../../../services/bucket.service";


@Component({
  selector: 'bucket-dialog',
  templateUrl: './bucket-dialog.component.html',
  styleUrls: ['./bucket-dialog.component.scss']
})
export class BucketDialogComponent {


  constructor(public bucketService: BucketService){
  }

//   trackElement() {
//     this.bucket.forEach((item) => {
//       this.bucketService.setSum(item.price, true);
//     })
// }


}
