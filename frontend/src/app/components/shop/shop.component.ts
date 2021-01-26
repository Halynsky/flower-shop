import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FlowerService } from "../../api/services/flower.service";
import { SnackBarService } from "../../services/snak-bar.service";
import { ShopFilterParams, ShopFilters } from "../../api/models/ShopFilters";
import { Pagination } from "../../api/models/Pagination";
import { RestPage } from "../../api/models/RestPage";
import { ShopFilterDialogComponent } from "../shared/shop-filter-dialog/shop-filter-dialog.component";
import { finalize, takeUntil } from "rxjs/operators";
import { getErrorMessage } from "../../utils/Functions";
import { DOCUMENT } from "@angular/common";
import { GlobalSearchService } from "../../services/global-search.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { FlowerSizeService } from "../../api/services/flower-size.service";
import { FlowerSize } from "../../api/models/FlowerSize";
import { ShopCacheService } from "../../services/shop-cache.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LAST_VISITED_ITEM } from "../../utils/Costants";
import { ShopFilterService } from "../../services/shop-filter.service";

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  host: {'(window:scroll)': 'trackScroll($event)'}
})
export class ShopComponent implements OnInit, OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  private DEFAULT_PAGE_SIZE = 9;
  private DISTANCE_TO_BOTTOM_WHEN_LOAD_MORE = 200;
  public DISTANCE_FROM_TOP_WHEN_SHOW_GO_TOP_BUTTON = 300;

  initialized: boolean = false;

  flowersPage: RestPage<FlowerSize> = new RestPage<FlowerSize>();

  sortOptions = [
    {label: "За популярністю", value: "popularity,DESC"},
    {label: "Від дешевших до дорожчих", value: "price,ASC"},
    {label: "Від дорожчих до дешевших", value: "price,DESC"},
    {label: "За новизною", value: "created,DESC"}
  ]


  pagination: Pagination;

  shopFilterDialogRef: MatDialogRef<any>;
  loading = true;

  pageYOffset = 0;

  constructor(private flowerService: FlowerService,
              private flowerSizeService: FlowerSizeService,
              private snackBarService: SnackBarService,
              private changeDetectorRef: ChangeDetectorRef,
              public dialog: MatDialog,
              @Inject('Window') public window: Window,
              @Inject(DOCUMENT) private document: Document,
              private globalSearchService: GlobalSearchService,
              private shopCacheService: ShopCacheService,
              private route: ActivatedRoute,
              private router: Router,
              public shopFilterService: ShopFilterService) {

    this.readQueryParams()

  }

  ngOnInit() {
    console.log("ngOnInit")
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  readQueryParams() {
    this.route.queryParams
      .subscribe(params => {
        if (!this.shopFilterService.initialized) this.shopFilterService.init(params as ShopFilterParams)
        this.onFilterChange();
      });
  }

  getShopItems(filters?: ShopFilters, showMore: boolean = false) {
    let pagination = this.pagination;

    if (!this.initialized) {
      pagination = new Pagination(0, (pagination.page + 1) * pagination.size, pagination.sort)
    }

    this.loading = true;
    this.flowerSizeService.getAllForShop(pagination, filters)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.shopCacheService.cachedData = this.flowersPage;
          this.shopFilterService.loadingShowMore = false;
        }),
        takeUntil(this.destroyed$)
      ).subscribe(
      page => {
        if (!showMore) {
          this.flowersPage = page

          if (!this.initialized) {
            setTimeout(() => {

              let item = document.getElementById(`item_${sessionStorage.getItem(LAST_VISITED_ITEM)}`);

              if (item) {
                item.scrollIntoView()
                document.querySelector('html').scrollTop -= 100
                sessionStorage.removeItem(LAST_VISITED_ITEM)
              }

            })
          }

        } else {
          page.content.unshift(...this.flowersPage.content);
          page.numberOfElements += this.flowersPage.numberOfElements;
          this.flowersPage = page;
        }

        if (!this.initialized) this.initialized = true;
      },
      error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  trackByFn(index, item) {
    return item.id
  }

  onFilterChange() {
    this.pagination = new Pagination(this.shopFilterService.filters.page, this.DEFAULT_PAGE_SIZE, this.shopFilterService.filters.sort)
    this.getShopItems(this.clearPageableFromFilters(this.shopFilterService.filters), this.shopFilterService.loadingShowMore);
  }

  clearPageableFromFilters(allFilters) {
    let filters = {...allFilters}
    delete filters.page;
    delete filters.sort;
    return filters;
  }

  sortSelectionChange(event) {
    this.shopFilterService.afterFilterChange()
  }

  searchTermChange(event) {
    this.shopFilterService.afterFilterChange()
  }

  searchTermCleared(event) {
    this.searchTermChange(event)
  }

  openFilterModal() {
    this.shopFilterDialogRef = this.dialog.open(ShopFilterDialogComponent, {
      height: '100vh',
      width: '100vw',
    });

  }

  showMore() {
    this.shopFilterService.showMore();
  }

  trackScroll(event: any) {
    this.pageYOffset = this.window.pageYOffset;
    let scrollToBottom = this.document.scrollingElement.scrollHeight - this.window.innerHeight - this.window.pageYOffset;
    if (scrollToBottom < this.DISTANCE_TO_BOTTOM_WHEN_LOAD_MORE && !this.flowersPage.last && !this.loading) {
      this.showMore();
    }
  }

}
