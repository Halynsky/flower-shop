import { Component } from "@angular/core";
import { ModalWindowService } from "../../../../services/modal-window.service";
import { BucketService } from "../../../../services/bucket.service";


@Component({
  selector: 'modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss']
})
export class ModalWindowComponent {


  constructor(private modalPageService: ModalWindowService, private bucketService: BucketService){
  }

//   trackElement() {
//     this.bucket.forEach((item) => {
//       this.bucketService.setSum(item.price, true);
//     })
// }

}
