import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BucketLocalService } from "../../services/bucket-local.service";
import { DeliveryType, deliveryTypeOptions } from 'app/models/DeliveryType';
import { OrderService } from "../../api/services/order.service";
import { SecurityService } from "../../services/security.service";
import { MatDialog, MatRadioChange } from "@angular/material";
import { Observable, of } from "rxjs";
import { timeout } from "rxjs/operators";
import { OrderRequest } from "../../api/models/Order";
import { BucketDialogComponent } from "../shared/bucket-dialog/bucket-dialog.component";
import { SnackBarService } from "../../services/snak-bar.service";
import { getErrorMessage } from "../../utils/Functions";

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  DeliveryType = DeliveryType;
  deliveryTypeOptions = deliveryTypeOptions;

  contactInfoFormGroup: FormGroup;
  deliveryInfoFormGroup: FormGroup;

  orderId;

  constructor(private formBuilder: FormBuilder,
              public bucketLocalService: BucketLocalService,
              private securityService: SecurityService,
              private orderService: OrderService,
              public snackBarService: SnackBarService,
              public dialog: MatDialog) {
  }

  ngOnInit() {

    this.contactInfoFormGroup = this.formBuilder.group({
      name: [''],
      email: [''],
      phone: ['']
    });

    this.deliveryInfoFormGroup = this.formBuilder.group({
      deliveryType: [DeliveryType.NOVA_POSHTA_DEPARTMENT],
      city: [''],
      street: [''],
      house: [''],
      apartment: [''],
      novaPoshtaDepartment: [''],
      comment: ['']
    });

    this.fillUserData();

  }

  fillUserData() {
    if (this.securityService.isAuthenticated()) {
      let user = this.securityService.getUser();
      this.contactInfoFormGroup.get('name').setValue(user.name);
      this.contactInfoFormGroup.get('email').setValue(user.email);
      this.contactInfoFormGroup.get('phone').setValue(user.phone);
    }
  }

  submitOrder() {
    let orderRequest = new OrderRequest();
    orderRequest.orderItems = this.bucketLocalService.bucket;
    orderRequest.contactInfo = this.contactInfoFormGroup.getRawValue();
    orderRequest.deliveryInfo = this.deliveryInfoFormGroup.getRawValue();
    this.orderService.create(orderRequest).subscribe(orderId => {
      this.bucketLocalService.clearBucket();
      this.orderId = orderId;
    }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  directAddressRequired() {
    return this.deliveryInfoFormGroup.get('deliveryType').value == DeliveryType.NOVA_POSHTA_COURIER
      || this.deliveryInfoFormGroup.get('deliveryType').value == DeliveryType.UKR_POSHTA_DEPARTMENT
  }

  onDeliveryTypeChange(event: MatRadioChange) {

    this.deliveryInfoFormGroup.get('city').clearValidators();
    this.deliveryInfoFormGroup.get('street').clearValidators();
    this.deliveryInfoFormGroup.get('house').clearValidators();
    this.deliveryInfoFormGroup.get('apartment').clearValidators();
    this.deliveryInfoFormGroup.get('novaPoshtaDepartment').clearValidators();

    switch (event.value) {
      case DeliveryType.NOVA_POSHTA_COURIER:
      case DeliveryType.UKR_POSHTA_DEPARTMENT: {
        this.deliveryInfoFormGroup.get('city').setValidators([Validators.required]);
        this.deliveryInfoFormGroup.get('street').setValidators([Validators.required]);
        this.deliveryInfoFormGroup.get('house').setValidators([Validators.required]);
        this.deliveryInfoFormGroup.get('apartment').setValidators([Validators.required]);
        break;
      }
      case DeliveryType.NOVA_POSHTA_DEPARTMENT: {
        this.deliveryInfoFormGroup.get('city').setValidators([Validators.required]);
        this.deliveryInfoFormGroup.get('novaPoshtaDepartment').setValidators([Validators.required]);
        break;
      }
      case DeliveryType.SELF_UZHGOROD: {
        break;
      }

    }

    this.deliveryInfoFormGroup.get('city').updateValueAndValidity();
    this.deliveryInfoFormGroup.get('street').updateValueAndValidity();
    this.deliveryInfoFormGroup.get('house').updateValueAndValidity();
    this.deliveryInfoFormGroup.get('apartment').updateValueAndValidity();
    this.deliveryInfoFormGroup.get('novaPoshtaDepartment').updateValueAndValidity();

  }

  isFormValid(): Observable<boolean> {
    return of(this.contactInfoFormGroup.invalid || this.deliveryInfoFormGroup.invalid).pipe(timeout(0))
  }

  openBucketDialog() {
    this.dialog.open(BucketDialogComponent, {width: "80%", panelClass: "modal-panel-no-padding", maxWidth: 800});
  }

}
