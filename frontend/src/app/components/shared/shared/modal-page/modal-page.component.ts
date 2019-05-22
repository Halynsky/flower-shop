import { Component } from "@angular/core";
import { ModalPageService } from "../../../../api/services/modal-page.service";

@Component({
  selector: 'modal-page',
  templateUrl: './modal-page.component.html',
  styleUrls: ['./modal-page.component.scss']
})
export class ModalPageComponent {

  constructor(private modalPageService: ModalPageService ){

  }

}
