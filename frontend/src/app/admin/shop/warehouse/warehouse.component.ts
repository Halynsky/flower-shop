import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemSaveMode } from "../../../models/ItemSaveMode";
import { SnackBarService } from "../../../services/snak-bar.service";
import { Table } from "primeng/table";
import { getErrorMessage, ngPrimeFiltersToParams } from "../../../utils/Functions";
import { Pagination } from "../../../api/models/Pagination";
import { RestPage } from "../../../api/models/RestPage";
import { FlowerSizeService } from "../../../api/services/flower-size.service";
import { FlowerSize } from "../../../api/models/FlowerSize";
import { FlowerTypeService } from "../../../api/services/flower-type.service";

@Component({
  selector: 'warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  @ViewChild('dt', { static: false }) private table: Table;

  ItemSaveMode = ItemSaveMode;

  columns = [
    {field: 'id', header: 'Id', active: true},
    {field: 'image', header: 'Фото', active: true},
    {field: 'flower', header: 'Назва', active: true},
    {field: 'flowerType', header: 'Тип', active: true},
    {field: 'size', header: 'Розмір', active: true},
    {field: 'price', header: 'Ціна, грн', active: true},
    {field: 'priceOld', header: 'Ціна(до знижки), грн', active: false},
    {field: 'amount', header: 'Кількість', active: true},
    {field: 'sold', header: 'Продано', active: true},
    {field: 'reserved', header: 'Зарезервовано', active: true},
    {field: 'available', header: 'Доступно', active: true},
  ];

  selectedColumns = this.columns.filter(column => column.active);

  items: RestPage<FlowerSize> = new RestPage<FlowerSize>();

  flowerTypes = [];

  constructor(private dataService: FlowerSizeService,
              private flowerTypeService: FlowerTypeService,
              private snackBarService: SnackBarService) {
    this.getTypes();
  }

  ngOnInit() {
  }

  loadDataLazy(filters = {}, pagination: Pagination = new Pagination()) {
    this.dataService.getAllForAdmin(filters, pagination).subscribe(
      items => this.items = items,
      error => this.snackBarService.showError(error.error.message)
    )
  }

  onLazyLoad(event: any) {
    this.loadDataLazy(ngPrimeFiltersToParams(event.filters), new Pagination().fromPrimeNg(event));
  }

  refresh(): void {
    this.table.onLazyLoad.emit(this.table.createLazyLoadMetadata());
  }

  onColumnSelect(event) {
    let changedColumn = this.columns.find(column => column.field == event.itemValue.field);
    changedColumn.active = !changedColumn.active;
    this.filterSelectedColumns()
  }

  filterSelectedColumns() {
    this.selectedColumns = this.columns.filter(column => column.active);
  }

  getTypes() {
    this.flowerTypeService.getAll().subscribe(flowerTypes => {
        this.flowerTypes = flowerTypes.map(flowerType => { return {value: flowerType.name, label: flowerType.name}})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

}
