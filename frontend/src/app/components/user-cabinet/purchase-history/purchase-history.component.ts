import { Component } from "@angular/core";
import { OrderService } from "../../../api/services/order.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { RestPage } from "../../../api/models/RestPage";
import { Order } from "../../../api/models/Order";
import { Pagination } from "../../../api/models/Pagination";
import { finalize } from "rxjs/operators";
import { TranslationService } from "../../../utils/translation.service";

@Component({
  selector: 'purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss']
})

export class PurchaseHistoryComponent {

  private DEFAULT_PAGE_SIZE = 10;
  orders: RestPage<Order> = new RestPage<Order>();
  loading = false;
  pagination: Pagination;

  constructor (public orderService: OrderService,
               public snackBarService: SnackBarService,
               public translationService: TranslationService) {

    this.getMyOrders(false);

  }

  getMyOrders(showMore: boolean = false) {
    this.pagination = showMore ? this.pagination.nextPage() : new Pagination(0, this.DEFAULT_PAGE_SIZE);
    this.loading = true;
    this.orderService.getMyOrders(this.pagination)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      orders => {
        if (!showMore) {
          this.orders = orders
        } else {
          orders.content.unshift(...this.orders.content);
          orders.numberOfElements += this.orders.numberOfElements;
          this.orders = orders;
        }
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  trackByFn(index, item) {
    return item.id
  }

  showMore() {
    this.getMyOrders(true);
  }

}
