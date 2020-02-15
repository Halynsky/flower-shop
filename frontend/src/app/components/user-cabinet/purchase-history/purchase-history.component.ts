import { Component, OnDestroy } from "@angular/core";
import { OrderService } from "../../../api/services/order.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { RestPage } from "../../../api/models/RestPage";
import { Order } from "../../../api/models/Order";
import { Pagination } from "../../../api/models/Pagination";
import { finalize, takeUntil } from "rxjs/operators";
import { TranslationService } from "../../../utils/translation.service";
import { HowToPayDialogComponent } from "../../shared/how-to-pay-dialog/how-to-pay-dialog.component";
import { FLOWER_IMAGE_PLACEHOLDER } from "../../../utils/Costants";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";

@Component({
  selector: 'purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss']
})

export class PurchaseHistoryComponent implements OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  private DEFAULT_PAGE_SIZE = 10;
  orders: RestPage<Order> = new RestPage<Order>();
  loading = false;
  pagination: Pagination;
  flowerImagePlaceholder = FLOWER_IMAGE_PLACEHOLDER;

  constructor (public orderService: OrderService,
               public snackBarService: SnackBarService,
               public translationService: TranslationService,
               public dialog: MatDialog) {

    this.getMyOrders(false);

  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getMyOrders(showMore: boolean = false) {
    this.pagination = showMore ? this.pagination.nextPage() : new Pagination(0, this.DEFAULT_PAGE_SIZE);
    this.loading = true;
    this.orderService.getMyOrders(this.pagination)
      .pipe(
        finalize(() => this.loading = false),
        takeUntil(this.destroyed$)
      ).subscribe(orders => {
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

  openHowToPayDialog(event) {
    this.dialog.open(HowToPayDialogComponent, {maxWidth: 800, minWidth: 320, minHeight: 320, width: '600px'});
  }

}
