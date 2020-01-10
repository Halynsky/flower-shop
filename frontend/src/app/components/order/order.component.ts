import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { BucketLocalService } from "../../services/bucket-local.service";
import { DeliveryType, deliveryTypeOptions } from 'app/models/DeliveryType';
import { OrderService } from "../../api/services/order.service";
import { SecurityService } from "../../services/security.service";
import { MatAutocompleteSelectedEvent, MatDialog, MatRadioChange } from "@angular/material";
import { Observable, of } from "rxjs";
import { finalize, timeout } from "rxjs/operators";
import { OrderRequest } from "../../api/models/Order";
import { BucketDialogComponent } from "../shared/bucket-dialog/bucket-dialog.component";
import { SnackBarService } from "../../services/snak-bar.service";
import { getErrorMessage } from "../../utils/Functions";
import { NovaPoshtaService } from "../../api/services/nova-poshta.service";

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

  selectedCity;
  cities = [];
  warehouses = [];
  filteredWarehouses = [];
  streets = [];

  loadingWarehouses = false;
  loadingStreets = false;

  constructor(private formBuilder: FormBuilder,
              public bucketLocalService: BucketLocalService,
              private securityService: SecurityService,
              private orderService: OrderService,
              public snackBarService: SnackBarService,
              public dialog: MatDialog,
              public novaPoshtaService: NovaPoshtaService) {

    this.getCities();
    this.getWarehouses();
    this.getStreets();

    this.contactInfoFormGroup = this.formBuilder.group({
      name: [''],
      email: [''],
      phone: ['']
    });

    this.initFormGroups(DeliveryType.NOVA_POSHTA_DEPARTMENT);

    this.fillUserData();

  }

  ngOnInit() {
  }

  getCities(namePart: string = '') {
    this.novaPoshtaService.getCitiesByName(namePart)
      .subscribe(response => {
        if (response.data[0]) {
          this.cities = response.data[0].Addresses;
        } else {
          this.cities = [];
        }
      }, error => {
        this.snackBarService.showError("Помилка доступу до бази даних Новоъ Пошти")
      })
  }

  getWarehouses(settlementRef: string = '') {
    this.loadingWarehouses = true;
    this.novaPoshtaService.getWarehousesByCityRef(settlementRef)
      .pipe(finalize(() => this.loadingWarehouses = false))
      .subscribe(response => {
        this.warehouses = this.filteredWarehouses = response.data
      }, error => {
        this.snackBarService.showError("Помилка доступу до бази даних Новоъ Пошти")
      })
  }

  getStreets(settlementRef: string = '', streetNamePart: string = '') {
    this.loadingStreets = true;
    this.novaPoshtaService.getStreets(settlementRef, streetNamePart)
      .pipe(finalize(() => this.loadingStreets = false))
      .subscribe(response => {
        if (response.data[0]) {
          this.streets = response.data[0].Addresses;
        } else {
          this.streets = [];
        }
      }, error => {
        this.snackBarService.showError("Помилка доступу до бази даних Новоъ Пошти")
      })
  }

  displayCityFn = item => item ? item.Present : item;

  displayWarehouseFn = item => item ? item.Description : item;

  displayStreetFn = item => item ? item.Present : item;

  onCitySelect(event: MatAutocompleteSelectedEvent) {
    this.selectedCity = event.option.value;
    if (this.deliveryInfoFormGroup.get('novaPoshtaDepartment')) {
      this.deliveryInfoFormGroup.get('novaPoshtaDepartment').reset();
    }
    if (this.deliveryInfoFormGroup.get('street')) {
      this.deliveryInfoFormGroup.get('street').reset();
      this.deliveryInfoFormGroup.get('house').reset();
      this.deliveryInfoFormGroup.get('house').reset();
    }

    this.getWarehouses(event.option.value.Ref);
    this.getStreets(event.option.value.Ref);

  }

  onNovaPoshtaDepartmentSelect(event: MatAutocompleteSelectedEvent) {
  }

  onStreetSelect($event: MatAutocompleteSelectedEvent) {

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
    if (orderRequest.deliveryInfo.city) {
      orderRequest.deliveryInfo.city = orderRequest.deliveryInfo.city.Present;
    }
    if (orderRequest.deliveryInfo.street) {
      orderRequest.deliveryInfo.street = orderRequest.deliveryInfo.street.Present;
    }
    if (orderRequest.deliveryInfo.novaPoshtaDepartment) {
      orderRequest.deliveryInfo.novaPoshtaDepartment = orderRequest.deliveryInfo.novaPoshtaDepartment.Description;
    }

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
    this.initFormGroups(event.value)
  }

  initFormGroups(deliveryType: DeliveryType) {

    let previousComment;
    let previousCity;
    let previousStreet;
    let previousHouse;
    let previousApartment;

    let previousFormGroup = this.deliveryInfoFormGroup;

    if (previousFormGroup) {
      previousComment = previousFormGroup.get('comment') ? previousFormGroup.get('comment').value : null;
      previousCity = previousFormGroup.get('city') ? previousFormGroup.get('city').value : null;
      previousStreet = previousFormGroup.get('street') ? previousFormGroup.get('street').value : null;
      previousHouse = previousFormGroup.get('house') ? previousFormGroup.get('house').value : null;
      previousApartment = previousFormGroup.get('apartment') ? previousFormGroup.get('apartment').value : null;
    }

    this.deliveryInfoFormGroup = new FormGroup({});
    this.deliveryInfoFormGroup.addControl('deliveryType', new FormControl(deliveryType));
    this.deliveryInfoFormGroup.addControl('comment', new FormControl(previousComment));

    switch (deliveryType) {
      case DeliveryType.NOVA_POSHTA_COURIER:
      case DeliveryType.UKR_POSHTA_DEPARTMENT: {
        this.deliveryInfoFormGroup.addControl('city', new FormControl(previousCity));
        this.deliveryInfoFormGroup.addControl('street', new FormControl(previousStreet));
        this.deliveryInfoFormGroup.addControl('house', new FormControl(previousHouse));
        this.deliveryInfoFormGroup.addControl('apartment', new FormControl(previousApartment));
        break;
      }
      case DeliveryType.NOVA_POSHTA_DEPARTMENT: {
        this.deliveryInfoFormGroup.addControl('city', new FormControl(previousCity));
        this.deliveryInfoFormGroup.addControl('novaPoshtaDepartment', new FormControl());
        break;
      }
      case DeliveryType.SELF_UZHGOROD: {

        break;
      }

    }

    if(this.deliveryInfoFormGroup.get('city')) {
      this.deliveryInfoFormGroup.get('city').valueChanges.subscribe(value => {
        this.getCities(value);
      });
    }

    if(this.deliveryInfoFormGroup.get('novaPoshtaDepartment')) {
      this.deliveryInfoFormGroup.get('novaPoshtaDepartment').valueChanges.subscribe(value => {
        if (value) {
          this.filteredWarehouses = this.warehouses.filter(option => {
            return typeof value == 'string' ? option.Description.toLowerCase().includes(value.toLowerCase()) : true
          })
        }
      });
    }

    if(this.deliveryInfoFormGroup.get('street')) {
      this.deliveryInfoFormGroup.get('street').valueChanges.subscribe(value => {
        if (value && typeof value == 'string') {
          this.getStreets(this.selectedCity.Ref, value);
        }
      });
    }

  }

  isFormValid(): Observable<boolean> {
    return of(this.contactInfoFormGroup.invalid || this.deliveryInfoFormGroup.invalid).pipe(timeout(0))
  }

  openBucketDialog() {
    this.dialog.open(BucketDialogComponent, {width: "80%", panelClass: "modal-panel-no-padding", maxWidth: 800});
  }



}
