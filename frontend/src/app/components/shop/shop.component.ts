import { Component, OnInit } from '@angular/core';
import { FlowerService } from "../../api/services/flower.service";
import { Flower, FlowerShort } from "../../api/models/Flower";
import { SnackBarService } from "../../services/snak-bar.service";
import { ShopFilter } from "../../api/models/ShopFilter";
import { Pagination } from "../../api/models/Pagination";
import { RestPage } from "../../api/models/RestPage";

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

  constructor(private flowerService: FlowerService,
              private snackBarService: SnackBarService) {
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

  onFilterChange($event) {
    this.filters = $event;
    this.getShopItems(this.searchTerm, this.pagination, this.filters)
  }

  sortSelectionChange($event) {
    this.pagination.sort = this.sort;
    this.getShopItems(this.searchTerm, this.pagination, this.filters)
  }

  searchTermChange($event) {
    this.getShopItems(this.searchTerm, this.pagination, this.filters)
  }

  searchTermCleared() {
    this.getShopItems(this.searchTerm, this.pagination, this.filters)
  }

}
