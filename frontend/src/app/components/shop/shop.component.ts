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
import { GlobalSearchService } from "../../services/global-search.service";

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  host: {'(window:scroll)': 'trackScroll($event)'}
})
export class ShopComponent implements OnInit {

  private DEFAULT_PAGE_SIZE = 9;
  private DISTANCE_TO_BOTTOM_WHEN_LOAD_MORE = 200;
  private DISTANCE_FROM_TOP_WHEN_SHOW_GO_TOP_BUTTON = 300;

  flowersPage: RestPage<FlowerShort> = new RestPage<FlowerShort>();
  filters: ShopFilter = new ShopFilter();
  sort = 'hasAvailableFlowerSize,DESC,isPopular,DESC,popularity,DESC';
  searchTerm = '';

  pagination: Pagination;

  shopFilterDialogRef: MatDialogRef<any>;
  loading = true;

  pageYOffset = 0;

  constructor(private flowerService: FlowerService,
              private snackBarService: SnackBarService,
              private changeDetectorRef: ChangeDetectorRef,
              public dialog: MatDialog,
              @Inject('Window') private window: Window,
              @Inject(DOCUMENT) private document: Document,
              private globalSearchService: GlobalSearchService) {
    //this.getShopItems(this.searchTerm);
    this.globalSearchService.onSearchTermChange.subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.searchTermChange(null)
    })
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
    this.window.scrollTo(0, 0);
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
    this.pageYOffset = this.window.pageYOffset;
    let scrollToBottom = this.document.scrollingElement.scrollHeight - this.window.innerHeight - this.window.pageYOffset;
    if (scrollToBottom < this.DISTANCE_TO_BOTTOM_WHEN_LOAD_MORE && !this.flowersPage.last && ! this.loading) {
      this.showMore();
    }
  }

}
