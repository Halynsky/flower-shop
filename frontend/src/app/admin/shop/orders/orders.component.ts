import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from "primeng";
import { RestPage } from "../../../api/models/RestPage";
import { ItemSaveMode } from "../../../models/ItemSaveMode";
import { Pagination } from "../../../api/models/Pagination";
import { getErrorMessage, ngPrimeFiltersToParams } from "../../../utils/Functions";
import { OrderService } from "../../../api/services/order.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { TranslationService } from "../../../utils/translation.service";
import { EnumToObjectsPipe } from "../../../pipes/enum-to-objects";
import { Order, OrderAdmin, OrderStatusChangeRequest } from "../../../api/models/Order";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  @ViewChild('dt', { static: false }) private table: Table;
  displayStatusChangeDialog = false;

  ItemSaveMode = ItemSaveMode;

  columns = [
    {field: 'id', header: 'Id', active: true},
    {field: 'created', header: 'Дата створення', active: true},
    {field: 'closed', header: 'Дата закриття', active: false},
    {field: 'status', header: 'Статус', active: true},
    {field: 'userId', header: 'Користувач(Id)', active: true},
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

  items: RestPage<OrderAdmin> = new RestPage<OrderAdmin>();

  statusesOptions = [];
  Status = Order.Status;

  createdFilters;
  closedFilters;

  selected: OrderAdmin;
  menuItems = [];

  orderStatusChangeRequest: OrderStatusChangeRequest = new OrderStatusChangeRequest();

  constructor(private dataService: OrderService,
              private snackBarService: SnackBarService,
              public translation: TranslationService,
              public enumToObjectsPipe: EnumToObjectsPipe,
              private router: Router,
              private route: ActivatedRoute) {
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

  initContextMenu() {
    this.menuItems = [
      {
        label: 'В обробку',
        icon: 'fas fa-dolly',
        command: (event) => {
          this.displayStatusChangeDialog = true;
          this.orderStatusChangeRequest.status = this.Status.PROCESSING;
        },
        visible: this.selected.status == this.Status.NEW,
        styleClass: 'cm-primary',
      },
      {
        label: 'Відправлено',
        icon: 'fas fa-shipping-fast',
        command: (event) => {
          this.displayStatusChangeDialog = true;
          this.orderStatusChangeRequest.status = this.Status.DELIVERING;
        },
        visible: this.orderIsEditable(this.selected.status),
        styleClass: 'cm-primary',
      },
      {
        label: 'Виконано',
        icon: 'fas fa-check',
        command: (event) => {
          this.displayStatusChangeDialog = true;
          this.orderStatusChangeRequest.status = this.Status.DONE;
        },
        visible: !this.orderIsClosed(this.selected.status),
        styleClass: 'cm-accent',
      },
      {
        label: 'Повернення',
        icon: 'fas fa-undo',
        command: (event) => {
          this.displayStatusChangeDialog = true;
          this.orderStatusChangeRequest.status = this.Status.RETURNED;
        },
        visible: !this.orderIsClosed(this.selected.status),
        styleClass: 'cm-warn',
      },
      {
        label: 'Відмінено',
        icon: 'fas fa-ban',
        command: (event) => {
          this.displayStatusChangeDialog = true;
          this.orderStatusChangeRequest.status = this.Status.CANCELED;
        },
        visible: !this.orderIsClosed(this.selected.status),
        styleClass: 'cm-danger',
      },
      {
        separator: true
      },
      {
        label: 'Підтвердити оплату',
        icon: 'fas fa-comments-dollar',
        command: (event) => this.confirmPayment(this.selected.id),
        visible: !this.orderIsClosed(this.selected.status),
      },
      {
        label: 'Редагувати реквізити',
        icon: 'fa fa-fw fa-pencil',
        command: (event) => this.foo(event),
        visible: this.orderIsEditable(this.selected.status),
      },
      {
        label: 'Редагувати позиції',
        icon: 'fas fa-cubes',
        command: (event) => this.foo(event),
        visible: this.orderIsEditable(this.selected.status),
      },
      {
        label: "Об'єднати замовлення",
        icon: 'fas fa-object-group',
        command: (event) => this.foo(event),
        visible: this.orderIsEditable(this.selected.status),
      },
      {
        label: "Розділити замовлення",
        icon: 'fas fa-object-ungroup',
        command: (event) => this.foo(event),
        visible: this.orderIsEditable(this.selected.status),
      },
      {
        separator: true
      },
      {
        label: "Перейти до користувача",
        icon: 'fas fa-user-tag',
        command: (event) => this.foo(event)
      },
    ];
  }

  onRowSelect(event) {
    this.initContextMenu();
  }

  foo(event) {
    this.snackBarService.methodNotImplemented()
  }

  orderIsClosed(status) {
    return [this.Status.CANCELED, this.Status.DONE, this.Status.RETURNED].includes(status)
  }

  orderIsEditable(status) {
    return !this.orderIsClosed(status) && status != this.Status.DELIVERING
  }

  confirmPayment(id: number) {
    this.dataService.confirmPayment(id).subscribe(() => {
      this.snackBarService.showSuccess(`Оплату для замовлення №${id} успішно підтверджено`);
      this.refresh();
    }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  changeStatus() {
    this.dataService.changeStatus(this.selected.id, this.orderStatusChangeRequest).subscribe(() => {
      this.snackBarService.showSuccess(`Статус для замовлення №${this.selected.id} успішно змінено на - ${this.translation.text.orderStatuses[this.orderStatusChangeRequest.status]}`);
      this.refresh();
      this.displayStatusChangeDialog = false;
    }, error => this.snackBarService.showError(getErrorMessage(error)))

  }

  resetStatusChangeForm(statusChangeForm: NgForm) {
    statusChangeForm.resetForm();
    this.orderStatusChangeRequest = new OrderStatusChangeRequest();
  }
}


