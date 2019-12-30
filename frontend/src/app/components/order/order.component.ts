import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { BucketLocalService } from "../../services/bucket-local.service";
import { deliveryTypeOptions } from 'app/models/DeliveryType';

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  deliveryTypeOptions = deliveryTypeOptions;

  contactInfoGroup: FormGroup;
  deliveryFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              public bucketLocalService: BucketLocalService) {}

  ngOnInit() {

    this.contactInfoGroup = this.formBuilder.group({
      name: [''],
      email: [''],
      phone: ['']
    });

    this.deliveryFormGroup = this.formBuilder.group({
      deliveryType: [''],
      city: [''],
      house: [''],
      apartment: [''],
      novaPoshtaDepartment: [''],
      comment: ['']
    });

  }

  submitOrder() {

  }
}
