import { Component } from "@angular/core";
import { ModalWindowService } from "../../../../api/services/modal-window.service";
import { BucketService } from "../../../../api/services/bucket.service";

@Component({
  selector: 'modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss']
})
export class ModalWindowComponent {

  constructor(private modalPageService: ModalWindowService, private bucketService: BucketService){

  }

}
