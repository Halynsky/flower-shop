import { Component, OnInit } from '@angular/core';
import { ContactUsService } from "../../../../services/contact-us.service";

@Component({
  selector: 'purchase-additional-info',
  templateUrl: './purchase-additional-info.component.html',
  styleUrls: ['./purchase-additional-info.component.scss']
})
export class PurchaseAdditionalInfoComponent implements OnInit {

  constructor(public contactUsService: ContactUsService) { }

  ngOnInit(): void {
  }

}
