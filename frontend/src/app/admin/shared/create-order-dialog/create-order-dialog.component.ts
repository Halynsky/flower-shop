import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { OrderCreateRequestAdmin } from "../../../api/models/OrderCreateRequestAdmin";
import { finalize } from "rxjs/operators";
import { getErrorMessage } from "../../../utils/Functions";
import { OrderService } from "../../../api/services/order.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { UserService } from "../../../api/services/user.service";

@Component({
  selector: 'create-order-dialog',
  templateUrl: './create-order-dialog.component.html',
  styleUrls: ['./create-order-dialog.component.scss']
})
export class CreateOrderDialogComponent implements OnInit {

  createOrderMode;
  loading = false;
  orderCreateRequestAdmin: OrderCreateRequestAdmin = new OrderCreateRequestAdmin();

  onCreate;

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private dataService: OrderService,
              private snackBarService: SnackBarService,
              public userService: UserService) {
    this.createOrderMode = config.data?.mode;
    this.onCreate = config.data?.onCreate;
    this.orderCreateRequestAdmin.userId = config.data?.userId;
  }

  ngOnInit(): void {
  }

  createOrder() {
    this.loading = true;
    this.dataService.createAsAdmin(this.orderCreateRequestAdmin)
      .pipe(finalize(() => this.loading = false))
      .subscribe(orderId => {
        this.snackBarService.showSuccess(`Замовлення ${orderId} успішно створено`);
        this.ref.close();
        this.onCreate && this.onCreate(orderId)
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

}
