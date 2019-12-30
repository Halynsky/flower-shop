import { Component, OnInit } from '@angular/core';
import { FlowerService } from "../../api/services/flower.service";
import { FlowerShort } from "../../api/models/Flower";
import { SnackBarService } from "../../services/snak-bar.service";
import { ShopFilter } from "../../api/models/ShopFilter";
import { Pagination } from "../../api/models/Pagination";
import { RestPage } from "../../api/models/RestPage";
import { MatDialog, MatDialogRef } from "@angular/material";
import { ShopFilterDialogComponent } from "../shared/shop-filter-dialog/shop-filter-dialog.component";

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  flowersPage: RestPage<FlowerShort> = new RestPage<FlowerShort>();
  filters: ShopFilter = new ShopFilter();
  sort = 'popularity,ASC';
  searchTerm = '';

  pagination: Pagination = new Pagination(0, 12);

  shopFilterDialogRef: MatDialogRef<any>;

  constructor(private flowerService: FlowerService,
              private snackBarService: SnackBarService,
              public dialog: MatDialog) {
    this.getShopItems(this.searchTerm, this.pagination);
  }

  ngOnInit() {
  }

  getShopItems(searchTerm: string, pagination: Pagination, filters?: ShopFilter) {
    this.flowerService.getForShop(searchTerm, pagination, filters).subscribe(
      page => this.flowersPage = page,
      error => this.snackBarService.showError(error)
      )
  }

  trackByFn(index, item) {
    return item.id
  }

  onFilterChange(event) {
    this.filters = event;
    this.getShopItems(this.searchTerm, this.pagination, this.filters)
  }

  sortSelectionChange(event) {
    this.pagination.sort = this.sort;
    this.getShopItems(this.searchTerm, this.pagination, this.filters)
  }

  searchTermChange(event) {
    this.getShopItems(this.searchTerm, this.pagination, this.filters)
  }

  searchTermCleared() {
    this.getShopItems(this.searchTerm, this.pagination, this.filters)
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

}
