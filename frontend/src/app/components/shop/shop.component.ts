import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FlowerService } from "../../api/services/flower.service";
import { SnackBarService } from "../../services/snak-bar.service";
import { ShopFilter } from "../../api/models/ShopFilter";
import { Pagination } from "../../api/models/Pagination";
import { RestPage } from "../../api/models/RestPage";
import { ShopFilterDialogComponent } from "../shared/shop-filter-dialog/shop-filter-dialog.component";
import { finalize, first, takeUntil } from "rxjs/operators";
import { getErrorMessage } from "../../utils/Functions";
import { DOCUMENT } from "@angular/common";
import { GlobalSearchService } from "../../services/global-search.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { FlowerSizeService } from "../../api/services/flower-size.service";
import { FlowerSize } from "../../api/models/FlowerSize";
import { ShopCacheService } from "../../services/shop-cache.service";
import { ActivatedRoute, Router } from "@angular/router";

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
  filters: ShopFilter = new ShopFilter();

  sortOptions = [
    {label: "За популярністю", value: "popularity,DESC"},
    {label: "Від дешевших до дорожчих", value: "price,ASC"},
    {label: "Від дорожчих до дешевших", value: "price,DESC"},
    {label: "За новизною", value: "created,DESC"}
  ]

  sort = 'popularity,DESC';
  searchTerm = '';

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
              private router: Router) {

    this.globalSearchService.onSearchTermChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.searchTermChange(null)
    })

  }

  ngOnInit() {
    console.log("ngOnInit")
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getShopItems(searchTerm: string = '', filters?: ShopFilter, showMore: boolean = false) {
    console.log("getShopItems showMore", showMore)
    let pagination = this.pagination;

    if (!this.initialized) {
      pagination = new Pagination(0, (pagination.page + 1) * pagination.size, pagination.sort)
    }

    this.loading = true;
    this.flowerSizeService.getAllForShop(searchTerm, pagination, filters)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.shopCacheService.cachedData = this.flowersPage;
        }),
        takeUntil(this.destroyed$)
      ).subscribe(
      page => {
        if (!showMore) {
          this.flowersPage = page
        } else {
          page.content.unshift(...this.flowersPage.content);
          page.numberOfElements += this.flowersPage.numberOfElements;
          this.flowersPage = page;
          console.log("this.initialized", this.initialized)
          if (!this.initialized) {
            setTimeout(() => {
              console.log("window.scrollTo")
              window.scrollTo(0, document.querySelector('html').scrollHeight);
            })
            this.initialized = true;
          }

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
    let originalPage = this.pagination?.page;
    this.pagination = new Pagination(parseInt(this.filters.page), this.DEFAULT_PAGE_SIZE, this.filters.sort)
    this.getShopItems(this.searchTerm, this.clearPageableFromFilters(this.filters), this.pagination.page != 0 && originalPage != this.pagination.page);
    // this.window.scrollTo(0, 0);
    this.changeDetectorRef.detectChanges();
  }

  clearPageableFromFilters(allFilters) {
    let filters = {...allFilters}
    delete filters.page;
    delete filters.sort;
    return filters;
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
    this.route.queryParams
      .pipe(first())
      .subscribe(params => {
        let newParams: any = {...params};
        newParams.page = this.pagination.page + 1
        newParams.sort = this.pagination.sort
        this.router.navigate(['shop'], {queryParams: newParams})
      })
  }

  trackScroll(event: any) {
    this.pageYOffset = this.window.pageYOffset;
    let scrollToBottom = this.document.scrollingElement.scrollHeight - this.window.innerHeight - this.window.pageYOffset;
    if (scrollToBottom < this.DISTANCE_TO_BOTTOM_WHEN_LOAD_MORE && !this.flowersPage.last && !this.loading) {
      this.showMore();
    }
  }

}
