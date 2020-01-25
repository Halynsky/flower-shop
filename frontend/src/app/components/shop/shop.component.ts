import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FlowerService } from "../../api/services/flower.service";
import { FlowerShort } from "../../api/models/Flower";
import { SnackBarService } from "../../services/snak-bar.service";
import { ShopFilter } from "../../api/models/ShopFilter";
import { Pagination } from "../../api/models/Pagination";
import { RestPage } from "../../api/models/RestPage";
import { MatDialog, MatDialogRef } from "@angular/material";
import { ShopFilterDialogComponent } from "../shared/shop-filter-dialog/shop-filter-dialog.component";
import { finalize } from "rxjs/operators";
import { getErrorMessage } from "../../utils/Functions";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  host: {'(window:scroll)': 'trackScroll($event)'}
})
export class ShopComponent implements OnInit {

  private DEFAULT_PAGE_SIZE = 9;

  flowersPage: RestPage<FlowerShort> = new RestPage<FlowerShort>();
  filters: ShopFilter = new ShopFilter();
  sort = 'hasAvailableFlowerSize,DESC,isPopular,DESC,popularity,ASC';
  searchTerm = '';

  pagination: Pagination;

  shopFilterDialogRef: MatDialogRef<any>;
  loading = true;

  constructor(private flowerService: FlowerService,
              private snackBarService: SnackBarService,
              private changeDetectorRef: ChangeDetectorRef,
              public dialog: MatDialog,
              @Inject('Window') private window: Window,
              @Inject(DOCUMENT) private document: Document) {
    //this.getShopItems(this.searchTerm);
  }

  ngOnInit() {
  }

  getShopItems(searchTerm: string, filters?: ShopFilter, showMore: boolean = false) {
    this.pagination = showMore ? this.pagination.nextPage() : new Pagination(0, this.DEFAULT_PAGE_SIZE, this.sort);
    this.loading = true;
    this.flowerService.getForShop(searchTerm, this.pagination, filters)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      page => {
        if (!showMore) {
          this.flowersPage = page
        } else {
          page.content.unshift(...this.flowersPage.content);
          page.numberOfElements += this.flowersPage.numberOfElements;
          this.flowersPage = page;
        }
      },
      error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  trackByFn(index, item) {
    return item.id
  }

  onFilterChange(event) {
    this.filters = event;
    this.getShopItems(this.searchTerm, this.filters);
    this.changeDetectorRef.detectChanges();
  }

  sortSelectionChange(event) {
    this.pagination.sort = this.sort;
    this.getShopItems(this.searchTerm, this.filters);
  }

  searchTermChange(event) {
    this.getShopItems(this.searchTerm, this.filters)
  }

  searchTermCleared() {
    this.getShopItems(this.searchTerm, this.filters)
  }

  openFilterModal() {
    this.shopFilterDialogRef = this.dialog.open(ShopFilterDialogComponent, {
      height: '100vh',
      width: '100vw',
    });

    this.shopFilterDialogRef.componentInstance.onFilterChange.subscribe(filter => {
      this.onFilterChange(filter);
    });
    this.shopFilterDialogRef.componentInstance.filters = this.filters;
  }

  showMore() {
    this.getShopItems(this.searchTerm, this.filters, true);
  }

  trackScroll(event: any) {
    let scrollToBottom = this.document.scrollingElement.scrollHeight - this.window.innerHeight - this.window.pageYOffset;

    if (scrollToBottom < 100 && !this.flowersPage.last) {
      this.showMore();
    }
  }

}
