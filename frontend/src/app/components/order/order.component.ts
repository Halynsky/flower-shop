import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BucketLocalService } from "../../services/bucket-local.service";

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  contactInfoGroup: FormGroup;
  shippingFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              public bucketLocalService: BucketLocalService) {}

  ngOnInit() {

    this.contactInfoGroup = this.formBuilder.group({
      name: [''],
      email: [''],
      phone: ['']
    });

    this.shippingFormGroup = this.formBuilder.group({
      city: ['']
    });

  }
}
