import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { OrderService } from "../../../api/services/order.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { UserService } from "../../../api/services/user.service";
import { IdAmountTuple } from "../../../api/models/IdAmountTuple";
import { finalize } from "rxjs/operators";
import { getErrorMessage } from "../../../utils/Functions";
import { OrderAdmin, OrderItemAdmin } from "../../../api/models/Order";
import { FlowerSize } from "../../../api/models/FlowerSize";
import { FlowerSizeService } from "../../../api/services/flower-size.service";

@Component({
  selector: 'app-update-order-items-dialog',
  templateUrl: './update-order-items-dialog.component.html',
  styleUrls: ['./update-order-items-dialog.component.scss']
})
export class UpdateOrderItemsDialogComponent implements OnInit {

  loading = false;
  updatingOrder: OrderAdmin;
  flowerSizes: FlowerSize[];
  flowerSizeToAdd: FlowerSize;

  onUpdate

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private dataService: OrderService,
              private snackBarService: SnackBarService,
              public userService: UserService,
              private flowerSizeService: FlowerSizeService) {
    this.updatingOrder = this.config.data.updatingOrder;
    this.onUpdate = config.data?.onUpdate;
    this.getAllFlowerSizes()
  }

  ngOnInit(): void {
  }

  getAllFlowerSizes() {
    this.loading = true
    this.flowerSizeService.getAllForAdminAsList()
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        flowerSizes => this.flowerSizes = flowerSizes,
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  updateOrderItems() {
    this.loading = true;
    this.dataService.updateOrderItems(this.updatingOrder.id, this.updatingOrder.orderItems.map(orderItem => new IdAmountTuple(orderItem.flowerSizeId, orderItem.amount)))
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
        this.snackBarService.showSuccess(`Замовлення №${this.updatingOrder.id} успішно оновлено`);
        this.ref.close()
        this.onUpdate && this.onUpdate()
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  addOrderItem() {

    if (this.flowerSizeToAdd && this.flowerSizeToAdd.available > 0) {
      let found =  !this.updatingOrder.orderItems ? null : this.updatingOrder.orderItems.find(item => item.flowerSizeId == this.flowerSizeToAdd.id);

      if (found) {
        found.amount++;
      } else {
        let orderItemAdmin: OrderItemAdmin = new OrderItemAdmin();
        orderItemAdmin.amount = 1;
        orderItemAdmin.flowerSizeId = this.flowerSizeToAdd.id;
        orderItemAdmin.image = this.flowerSizeToAdd.flower.image;
        orderItemAdmin.available =  this.flowerSizeToAdd.available;
        orderItemAdmin.name = this.flowerSizeToAdd.flower.nameOriginal;
        orderItemAdmin.sizeName = this.flowerSizeToAdd.size.name;
        orderItemAdmin.price = this.flowerSizeToAdd.price;
        this.updatingOrder.orderItems.unshift(orderItemAdmin);
      }

      this.flowerSizeToAdd.reserved++;
      this.flowerSizeToAdd.available--;

    }

  }

  minusAmount(index) {
    let flowerSize = this.flowerSizes.find(item => item.id == this.updatingOrder.orderItems[index].flowerSizeId);

    if(this.updatingOrder.orderItems[index].amount > 1) {
      this.updatingOrder.orderItems[index].amount--;
      flowerSize.reserved--;
      flowerSize.available++;
    }
  }

  plusAmount(index) {
    let flowerSize = this.flowerSizes.find(item => item.id == this.updatingOrder.orderItems[index].flowerSizeId);
    if (flowerSize.available > 0) {
      this.updatingOrder.orderItems[index].amount++;
      flowerSize.reserved++;
      flowerSize.available--;
    }
  }

  onAmountModelChange(event, orderItem: OrderItemAdmin) {
    let difference = event - orderItem.amount;
    let foundFlowerSize = this.flowerSizes.find(item => item.id == orderItem.flowerSizeId);
    foundFlowerSize.available = foundFlowerSize.available - difference;
    foundFlowerSize.reserved = foundFlowerSize.reserved + difference;
  }

  getMaxForFlowerSize(orderItem: OrderItemAdmin) {
    let foundFlowerSize = this.flowerSizes.find(item => item.id == orderItem.flowerSizeId);
    return parseInt(orderItem.amount as any) + parseInt(foundFlowerSize.available as any);
  }

  removeOrderItem(index) {
    let removedOrderItem = this.updatingOrder.orderItems.splice(index, 1)[0];
    let foundFlowerSize = this.flowerSizes.find(item => item.id == removedOrderItem.flowerSizeId);
    foundFlowerSize.reserved -= removedOrderItem.amount;
    foundFlowerSize.available += removedOrderItem.amount;
  }

}
