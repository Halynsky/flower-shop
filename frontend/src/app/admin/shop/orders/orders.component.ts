import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from "primeng";
import { RestPage } from "../../../api/models/RestPage";
import { ItemSaveMode } from "../../../models/ItemSaveMode";
import { Pagination } from "../../../api/models/Pagination";
import { ngPrimeFiltersToParams } from "../../../utils/Functions";
import { OrderService } from "../../../api/services/order.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { Order } from "../../../api/models/Order";
import { TranslationService } from "../../../utils/translation.service";
import { EnumToObjectsPipe } from "../../../pipes/enum-to-objects";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  @ViewChild('dt', { static: false }) private table: Table;

  ItemSaveMode = ItemSaveMode;

  columns = [
    {field: 'id', header: 'Id', active: true},
    {field: 'created', header: 'Дата створення', active: true},
    {field: 'closed', header: 'Дата закриття', active: false},
    {field: 'status', header: 'Статус', active: true},
    {field: 'user', header: 'Користувач', active: true},
    {field: 'userFacebookNickname', header: 'Нік на Facebook', active: true},
    {field: 'phone', header: 'Телефон', active: true},
    {field: 'deliveryAddress', header: 'Адреса доставки', active: true},
    {field: 'postDeclaration', header: 'Номер декларації', active: true},
    {field: 'comment', header: 'Коментар', active: true},
    {field: 'note', header: 'Примітки', active: true},
    {field: 'totalPrice', header: 'До оплати', active: true},
    {field: 'isPaid', header: 'Оплачено', active: true},
  ];

  selectedColumns = this.columns.filter(column => column.active);

  items: RestPage<Order> = new RestPage<Order>();

  statusesOptions = [];
  Status = Order.Status;

  createdFilters;
  closedFilters;

  constructor(private dataService: OrderService,
              private snackBarService: SnackBarService,
              public translation: TranslationService,
              public enumToObjectsPipe: EnumToObjectsPipe) {
    this.statusesOptions = enumToObjectsPipe.transform(Order.Status);
    this.statusesOptions.forEach(e => e.label = translation.text.orderStatuses[e.label]);
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

}
