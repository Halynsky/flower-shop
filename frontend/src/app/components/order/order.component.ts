import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { BucketLocalService } from "../../services/bucket-local.service";
import { DeliveryType, deliveryTypeOptions } from 'app/models/DeliveryType';
import { OrderService } from "../../api/services/order.service";
import { SecurityService } from "../../services/security.service";
import { Observable, of, Subject, Subscription } from "rxjs";
import { finalize, takeUntil, timeout } from "rxjs/operators";
import { OrderRequest } from "../../api/models/Order";
import { SnackBarService } from "../../services/snak-bar.service";
import { getErrorMessage } from "../../utils/Functions";
import { NovaPoshtaService } from "../../api/services/nova-poshta.service";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { MatDialog } from "@angular/material/dialog";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatRadioChange } from "@angular/material/radio";
import { ProfileService } from "../../api/services/profile.service";
import { UserExistDialogComponent } from "../shared/user-exist-dialog/user-exist-dialog.component";

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

  private readonly destroyed$ = new Subject<void>();

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
  loading = false;

  selectedStepIndex = 0;

  citySubs$: Subscription;
  novaPoshtaDepartmentSubs$: Subscription;
  streetSubs$: Subscription;

  constructor(private formBuilder: FormBuilder,
              public bucketLocalService: BucketLocalService,
              public securityService: SecurityService,
              private orderService: OrderService,
              public snackBarService: SnackBarService,
              public dialog: MatDialog,
              public novaPoshtaService: NovaPoshtaService,
              private changeDetectorRef: ChangeDetectorRef,
              private profileService: ProfileService) {

    this.getCities();
    this.getWarehouses();
    this.getStreets();

    this.contactInfoFormGroup = this.formBuilder.group({
      name: [],
      email: [],
      phone: []
    });

  }

  ngOnInit() {
    this.initFormGroups(DeliveryType.NOVA_POSHTA_DEPARTMENT, true);
    this.fillUserData();

    this.securityService.onLogin.subscribe(() => {
      this.fillUserData();
    });
    this.bucketLocalService.updateBucketFlowerSizes();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.unsubscribeFromDropdownChanges();
  }

  unsubscribeFromDropdownChanges() {
    if (this.citySubs$) this.citySubs$.unsubscribe();
    if (this.novaPoshtaDepartmentSubs$) this.novaPoshtaDepartmentSubs$.unsubscribe();
    if (this.streetSubs$) this.streetSubs$.unsubscribe();
  }

  getCities(namePart: string = '') {
    this.novaPoshtaService.getCitiesByName(namePart)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response.data[0]) {
          this.cities = response.data[0].Addresses;
        } else {
          this.cities = [];
        }
      }, error => {
        this.snackBarService.showError("Помилка доступу до бази даних Нової Пошти")
      })
  }

  getWarehouses(settlementRef: string = '') {
    this.loadingWarehouses = true;
    this.novaPoshtaService.getWarehousesByCityRef(settlementRef)
      .pipe(finalize(() => this.loadingWarehouses = false), takeUntil(this.destroyed$))
      .subscribe(response => {
        this.warehouses = this.filteredWarehouses = response.data
      }, error => {
        this.snackBarService.showError("Помилка доступу до бази даних Нової Пошти")
      })
  }

  getStreets(settlementRef: string = '', streetNamePart: string = '') {
    this.loadingStreets = true;
    this.novaPoshtaService.getStreets(settlementRef, streetNamePart)
      .pipe(finalize(() => this.loadingStreets = false), takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response.data[0]) {
          this.streets = response.data[0].Addresses;
        } else {
          this.streets = [];
        }
      }, error => {
        this.snackBarService.showError("Помилка доступу до бази даних Нової Пошти")
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
      this.deliveryInfoFormGroup.get('apartment').reset();
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
      if (user.phone) {
        this.contactInfoFormGroup.get('phone').setValue(user.phone);
      }
    }
  }

  submitOrder() {
    if (this.contactInfoFormGroup.invalid || this.deliveryInfoFormGroup.invalid) {
      this.snackBarService.showWarning("Заповніть, будь ласа, всі необхідні поля");
      return;
    }

    this.loading = true;
    let orderRequest = new OrderRequest();
    orderRequest.orderItems = this.bucketLocalService.bucket;
    orderRequest.contactInfo = this.contactInfoFormGroup.getRawValue();
    orderRequest.deliveryInfo = this.deliveryInfoFormGroup.getRawValue();
    if (orderRequest.deliveryInfo.city) {
      orderRequest.deliveryInfo.city = orderRequest.deliveryInfo.city.Present;
    }
    if (orderRequest.deliveryInfo.street && typeof orderRequest.deliveryInfo.street === 'object') {
      orderRequest.deliveryInfo.street = orderRequest.deliveryInfo.street.Present;
    }
    if (orderRequest.deliveryInfo.novaPoshtaDepartment) {
      orderRequest.deliveryInfo.novaPoshtaDepartment = orderRequest.deliveryInfo.novaPoshtaDepartment.Description;
    }

    this.orderService.create(orderRequest)
      .pipe(finalize(() => this.loading = false), takeUntil(this.destroyed$))
      .subscribe(orderId => {
        this.bucketLocalService.clearLocalBucket();
        this.orderId = orderId;
        this.updateProfile();
      }, error => {
        if (error.status = 409 && JSON.parse(error.error).message == 'USER_EXISTS') {
          let userExistDialog = this.securityService.dialog.open(UserExistDialogComponent);
          userExistDialog.componentInstance.email = orderRequest.contactInfo.email;
        } else {
          this.snackBarService.showError(getErrorMessage(error))
        }

      })
  }

  updateProfile() {
    let user = this.securityService.getUser();
    if (!user.phone) {
      this.profileService.get()
        .subscribe(
          profile => {
            user.email = profile.email;
            user.name = profile.name;
            user.phone = profile.phone;
            this.securityService.updateUser(user);
          }, error => this.snackBarService.showError(getErrorMessage(error))
        )
    }
  }

  directAddressRequired() {
    return this.deliveryInfoFormGroup.get('deliveryType').value == DeliveryType.NOVA_POSHTA_COURIER
      || this.deliveryInfoFormGroup.get('deliveryType').value == DeliveryType.UKR_POSHTA
  }

  onDeliveryTypeChange(event: MatRadioChange) {
    this.initFormGroups(event.value);
  }

  initFormGroups(deliveryType: DeliveryType, init: boolean = false) {

    if (init) {
      this.deliveryInfoFormGroup = new FormGroup({});
      this.deliveryInfoFormGroup.addControl('deliveryType', new FormControl(deliveryType));
      this.deliveryInfoFormGroup.addControl('comment', new FormControl());
      this.deliveryInfoFormGroup.addControl('receiverFullName', new FormControl());
      this.deliveryInfoFormGroup.addControl('receiverPhone', new FormControl());
    } else {
      this.unsubscribeFromDropdownChanges();
    }

    switch (deliveryType) {
      case DeliveryType.UKR_POSHTA:
        this.deliveryInfoFormGroup.removeControl('novaPoshtaDepartment');
        if (!this.deliveryInfoFormGroup.get('postalCode'))
          this.deliveryInfoFormGroup.addControl('postalCode', new FormControl());
        this.addDirectAddressControls();
        break;
      case DeliveryType.NOVA_POSHTA_COURIER: {
        this.deliveryInfoFormGroup.removeControl('novaPoshtaDepartment');
        this.deliveryInfoFormGroup.removeControl('postalCode');
        this.addDirectAddressControls();
        break;
      }
      case DeliveryType.NOVA_POSHTA_DEPARTMENT: {
        this.deliveryInfoFormGroup.removeControl('street');
        this.deliveryInfoFormGroup.removeControl('house');
        this.deliveryInfoFormGroup.removeControl('apartment');
        this.deliveryInfoFormGroup.removeControl('postalCode');
        this.deliveryInfoFormGroup.addControl('novaPoshtaDepartment', new FormControl());
        if (!this.deliveryInfoFormGroup.get('city'))
          this.deliveryInfoFormGroup.addControl('city', new FormControl());
        break;
      }
      case DeliveryType.SELF_UZHGOROD: {
        this.deliveryInfoFormGroup.removeControl('novaPoshtaDepartment');
        this.deliveryInfoFormGroup.removeControl('city');
        this.deliveryInfoFormGroup.removeControl('street');
        this.deliveryInfoFormGroup.removeControl('house');
        this.deliveryInfoFormGroup.removeControl('apartment');
        this.deliveryInfoFormGroup.removeControl('postalCode');
        break;
      }

    }

    if (this.deliveryInfoFormGroup.get('city')) {
      this.citySubs$ = this.deliveryInfoFormGroup.get('city').valueChanges.subscribe(value => {
        this.getCities(value);
      });
    }

    if (this.deliveryInfoFormGroup.get('novaPoshtaDepartment')) {
      this.novaPoshtaDepartmentSubs$ = this.deliveryInfoFormGroup.get('novaPoshtaDepartment').valueChanges.subscribe(value => {
        if (value) {
          this.filteredWarehouses = this.warehouses.filter(option => {
            return typeof value == 'string' ? option.Description.toLowerCase().includes(value.toLowerCase()) : true
          })
        }
      });
    }

    if (this.deliveryInfoFormGroup.get('street')) {
      this.streetSubs$ = this.deliveryInfoFormGroup.get('street').valueChanges.subscribe(value => {
        if (value && typeof value == 'string' && this.selectedCity) {
          this.getStreets(this.selectedCity.Ref, value);
        }
      });
    }

    this.changeDetectorRef.detectChanges();

  }

  addDirectAddressControls() {
    if (!this.deliveryInfoFormGroup.get('city'))
      this.deliveryInfoFormGroup.addControl('city', new FormControl());
    if (!this.deliveryInfoFormGroup.get('street'))
      this.deliveryInfoFormGroup.addControl('street', new FormControl());
    if (!this.deliveryInfoFormGroup.get('house'))
      this.deliveryInfoFormGroup.addControl('house', new FormControl());
    if (!this.deliveryInfoFormGroup.get('apartment'))
      this.deliveryInfoFormGroup.addControl('apartment', new FormControl());
  }

  isFormValid(): Observable<boolean> {
    return of(this.contactInfoFormGroup.invalid || this.deliveryInfoFormGroup.invalid).pipe(timeout(0))
  }

  stepperSelectionChanged(event: StepperSelectionEvent) {
    this.selectedStepIndex = event.selectedIndex;
  }

  hasErrorDelivery(formControlName: string) {
    return this.deliveryInfoFormGroup.get(formControlName).invalid && (this.deliveryInfoFormGroup.get(formControlName).dirty || this.deliveryInfoFormGroup.get(formControlName).touched)
  }

  hasErrorContactInfo(formControlName: string) {
    return this.contactInfoFormGroup.get(formControlName).invalid && (this.contactInfoFormGroup.get(formControlName).dirty || this.contactInfoFormGroup.get(formControlName).touched)
  }

}
