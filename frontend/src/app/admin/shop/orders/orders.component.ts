import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { RestPage } from "../../../api/models/RestPage";
import { ItemSaveMode } from "../../../models/ItemSaveMode";
import { Pagination } from "../../../api/models/Pagination";
import { clone, getErrorMessage, ngPrimeFiltersToParams } from "../../../utils/Functions";
import { OrderService } from "../../../api/services/order.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { TranslationService } from "../../../utils/translation.service";
import { EnumToObjectsPipe } from "../../../pipes/enum-to-objects";
import { Order, OrderAdmin, OrderContactsChangeRequest, OrderItemAdmin, OrderStatusChangeRequest } from "../../../api/models/Order";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { finalize } from "rxjs/operators";
import { FlowerSize } from "../../../api/models/FlowerSize";
import * as fileSaver from 'file-saver';
import { dataTableFilter } from "../../util";
import { UserService } from "../../../api/services/user.service";
import { FilterMetadata } from "primeng/api";
import { Table } from "primeng/table";
import * as moment from 'moment';
import { DialogService } from "primeng/dynamicdialog";
import { CreateOrderDialogComponent } from "../../shared/create-order-dialog/create-order-dialog.component";
import { UpdateOrderItemsDialogComponent } from "../../shared/update-order-items-dialog/update-order-items-dialog.component";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  @ViewChild('dt') private table: Table;
  displayStatusChangeDialog = false;
  displayContactsChangeDialog = false;
  displayNoteChangeDialog = false;
  displayMergeDialog = false;
  displaySplitDialog = false;
  displayDiscountChangeDialog = false;
  displayPaymentConfirmDialog = false;

  loading = false;

  ItemSaveMode = ItemSaveMode;

  columns = [
    {field: 'id', header: 'Id', active: true},
    {field: 'created', header: 'Дата створення', active: true},
    {field: 'closed', header: 'Дата закриття', active: false},
    {field: 'sent', header: 'Дата відправки', active: false},
    {field: 'status', header: 'Статус', active: true},
    {field: 'userId', header: 'Корист.Id', active: true},
    {field: 'user', header: 'Корист.', active: true},
    {field: 'userFacebookNickname', header: 'Нік на Facebook', active: false},
    {field: 'priceToPay', header: 'До сплати', active: true},
    {field: 'paid', header: 'Оплачено', active: true},
    {field: 'phone', header: 'Телефон', active: true},
    {field: 'deliveryAddress', header: 'Адреса доставки', active: false},
    {field: 'postDeclaration', header: 'Номер декларації', active: false},
    {field: 'comment', header: 'Коментар', active: true},
    {field: 'note', header: 'Примітки', active: false},
    {field: 'totalPrice', header: 'Вартість', active: false},
    {field: 'discount', header: 'Знижка', active: false},
  ];

  toProgressMenuItems = [
    {
      label: 'Відправити в обробку',
      icon: 'fas fa-bolt',
      command: (event) => this.changeStatusToProcessingForAll(),
    },
    {
      label: 'Експортувати в Excel',
      icon: 'fas fa-file-excel',
      command: (event) => this.exportAllToExcel(),
      styleClass: 'excel-export-button'
    },
    {
      label: 'Підготувати бланк обробки',
      icon: 'fas fa-table',
      command: (event) => this.prepareProcessingBlank(),
      styleClass: 'excel-export-button'
    }
  ];


  selectedColumns = this.columns.filter(column => column.active);

  items: RestPage<OrderAdmin> = new RestPage<OrderAdmin>();
  flowerSizes: FlowerSize[];

  statusesOptions = [];
  isPaidOptions = [
    {value: true, label: 'Оплачені'},
    {value: false, label: 'Неоплачені'}
  ];
  Status = Order.Status;

  createdFilters;
  closedFilters;
  sentFilters;

  selected: OrderAdmin;
  isContextMenuOpened = false;
  menuItems = [];

  orderStatusChangeRequest: OrderStatusChangeRequest = new OrderStatusChangeRequest();
  orderContactsChangeRequest: OrderContactsChangeRequest = new OrderContactsChangeRequest();
  orderNote;
  mergingOrderId;
  splittingOtherOrderItems: OrderItemAdmin[] = [];
  splittingOrder: OrderAdmin;
  updatingOrder: OrderAdmin;
  orderDiscount;
  paymentDate;
  orderAdvancePayment;

  lastLazyLoadEvent;

  displayZoomDialog = false;
  zoomedImage;

  filters: { [s: string]: FilterMetadata } = {};

  priceToPayMinMax = [0, 9999];
  priceToPayFilter = clone(this.priceToPayMinMax);


  constructor(private dataService: OrderService,
              public userService: UserService,
              private snackBarService: SnackBarService,
              public translation: TranslationService,
              public enumToObjectsPipe: EnumToObjectsPipe,
              private router: Router,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              public dialogService: DialogService) {
    this.statusesOptions = enumToObjectsPipe.transform(Order.Status);
    this.statusesOptions.forEach(e => e.label = translation.text.orderStatuses[e.label]);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      Object.assign(this.filters, dataTableFilter('userId', params['userId']));
      Object.assign(this.filters, dataTableFilter('id', params['id']));
    });
  }

  loadDataLazy(filters: any = {} , pagination: Pagination = new Pagination()) {
    this.dataService.getAllForAdmin(filters, pagination).subscribe(
      items => this.items = items,
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onLazyLoad(event: any) {
    this.lastLazyLoadEvent = event;
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
        label: 'Пакується',
        icon: 'fas fa-boxes',
        command: (event) => {
          this.displayStatusChangeDialog = true;
          this.orderStatusChangeRequest.status = this.Status.PACKAGING;
        },
        visible: this.orderIsEditable(this.selected.status),
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
        visible: this.selected.status == Order.Status.DELIVERING,
        styleClass: 'cm-warn',
      },
      {
        label: 'Відмінено',
        icon: 'fas fa-ban',
        command: (event) => {
          this.displayStatusChangeDialog = true;
          this.orderStatusChangeRequest.status = this.Status.CANCELED;
        },
        visible: this.orderIsEditable(this.selected.status),
        styleClass: 'cm-danger',
      },
      {
        separator: true
      },
      {
        label: 'Підтвердити оплату',
        icon: 'fas fa-comments-dollar',
        command: (event) => {
          this.displayPaymentConfirmDialog = true;
          this.orderAdvancePayment = this.selected.advancePayment ? this.selected.advancePayment / 100 : null
          this.paymentDate = this.selected.paid ? new Date(this.selected.paid) : null;
        },
        visible: ![this.Status.CANCELED, this.Status.CANCELED_AUTO, this.Status.RETURNED].includes(this.selected.status)
      },
      {
        label: 'Редагувати реквізити',
        icon: 'fa fa-fw fa-pencil',
        command: (event) => {
          this.displayContactsChangeDialog = true;
          this.orderContactsChangeRequest.phone = this.selected.phone;
          this.orderContactsChangeRequest.deliveryAddress = this.selected.deliveryAddress;
        },
        visible: this.orderIsEditable(this.selected.status),
      },
      {
        label: 'Редагувати позиції',
        icon: 'fas fa-cubes',
        command: (event) => {
          let updatingOrder = clone(this.selected);
          updatingOrder.orderItems = updatingOrder.orderItems.reverse();
          this.openUpdateOrderItemsDialog(updatingOrder)
        },
        visible: this.orderIsEditable(this.selected.status),
      },
      {
        label: "Об'єднати замовлення",
        icon: 'fas fa-object-group',
        command: (event) => {
          this.displayMergeDialog = true;
        },
        visible: this.orderIsEditable(this.selected.status),
      },
      {
        label: "Розділити замовлення",
        icon: 'fas fa-object-ungroup',
        command: (event) => {
          this.displaySplitDialog = true;
          this.splittingOrder = clone(this.selected);
        },
        visible: this.orderIsEditable(this.selected.status) && this.selected.orderItems.length > 1,
      },
      {
        label: "Додати примітку",
        icon: 'fas fa-clipboard',
        command: (event) => {
          this.displayNoteChangeDialog = true;
          this.orderNote = this.selected.note;
        },
      },
      {
        label: "Встановити знижку",
        icon: 'fas fa-percent',
        command: (event) => {
          this.displayDiscountChangeDialog = true;
          this.orderDiscount = this.selected.discount / 100;
        },
        visible: this.orderIsEditable(this.selected.status),
      },
      {
        label: 'Експортувати в Excel',
        icon: 'fas fa-file-excel',
        command: (event) => this.exportToExcel(this.selected.id),
        visible: !this.orderIsClosed(this.selected.status) && !this.selected.isPaid,
        styleClass: 'excel-export-button'
      },
      {
        separator: true
      },
      {
        label: "Відправити на email користувача",
        icon: 'far fa-envelope',
        command: (event) => this.sendOrderInEmail(this.selected.id),
        visible: this.orderIsEditable(this.selected.status),
      },
      {
        label: "Перейти до користувача",
        icon: 'fas fa-user-tag',
        command: (event) => this.router.navigate(['admin/users'], {queryParams: {id: this.selected.user.id}}),
        visible: this.selected.user,
      },
    ];
  }

  openCreateOrderDialog() {
    this.dialogService.open(CreateOrderDialogComponent, {
      data: {
        onCreate: (orderId: number) => {
          this.refresh()
          let updatingOrder = new OrderAdmin();
          updatingOrder.id = orderId;
          updatingOrder.orderItems = [];
          updatingOrder.orderItems = updatingOrder.orderItems.reverse();
          this.openUpdateOrderItemsDialog(updatingOrder)
        }
      },
      header: `Створити замовлення`,
      width: '500px'
    });
  }

  openUpdateOrderItemsDialog(updatingOrder: OrderAdmin) {
    this.dialogService.open(UpdateOrderItemsDialogComponent, {
      data: {
        updatingOrder: updatingOrder,
        onUpdate: () => this.refresh()
      },
      header: `Оновлення позицій замовлення №${updatingOrder.id}`,
      width: '700px'
    });
  }

  onContextMenuSelect(event) {
    this.selected = clone(event.data);
    this.initContextMenu();
    this.isContextMenuOpened = true;
  }

  onContextMenuHide(event) {
    this.isContextMenuOpened = false;
  }

  orderIsClosed(status) {
    return [this.Status.CANCELED, this.Status.CANCELED_AUTO, this.Status.DONE, this.Status.RETURNED].includes(status)
  }

  orderIsEditable(status) {
    return !this.orderIsClosed(status) && status != this.Status.DELIVERING
  }

  confirmPayment() {
    this.loading = true;
    // let date = this.paymentDate ?  this.paymentDate.toLocaleDateString().replace(/\./g,'-') : null;
    let date = this.paymentDate ?  moment(this.paymentDate).format('DD-MM-YYYY') : null;
    this.dataService.confirmPayment(this.selected.id, date, this.orderAdvancePayment ? this.orderAdvancePayment * 100 : undefined)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
      this.snackBarService.showSuccess(`Оплату для замовлення №${this.selected.id} успішно підтверджено`);
      this.refresh();
      this.displayPaymentConfirmDialog = false;
    }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  resetPaymentConfirmForm(form: NgForm) {
    form.resetForm();
    this.paymentDate = null;
  }

  changeStatus() {
    this.loading = true;
    this.dataService.changeStatus(this.selected.id, this.orderStatusChangeRequest)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
      this.snackBarService.showSuccess(`Статус для замовлення №${this.selected.id} успішно змінено на - ${this.translation.text.orderStatuses[this.orderStatusChangeRequest.status]}`);
      this.refresh();
      this.displayStatusChangeDialog = false;
    }, error => this.snackBarService.showError(getErrorMessage(error)))

  }

  resetStatusChangeForm(form: NgForm) {
    form.resetForm();
    this.orderStatusChangeRequest = new OrderStatusChangeRequest();
  }

  changeContacts() {
    this.loading = true;
    this.dataService.changeContacts(this.selected.id, this.orderContactsChangeRequest)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
      this.snackBarService.showSuccess(`Реквізити для замовлення №${this.selected.id} успішно змінено`);
      this.refresh();
      this.displayContactsChangeDialog = false;
    }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  resetContactsChangeForm(form: NgForm) {
    form.resetForm();
    this.orderContactsChangeRequest = new OrderContactsChangeRequest();
  }

  changeNote() {
    this.loading = true;
    this.dataService.changeNote(this.selected.id, this.orderNote)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
      this.snackBarService.showSuccess(`Примітку для замовлення №${this.selected.id} успішно змінено`);
      this.refresh();
      this.displayNoteChangeDialog = false;
    }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  resetNoteChangeForm(form: NgForm) {
    form.resetForm();
    this.orderNote = null;
  }

  merge() {
    this.loading = true;
    this.dataService.merge(this.selected.id, this.mergingOrderId)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
      this.snackBarService.showSuccess(`Замовлення №${this.selected.id} об'єднано з замовленням №${this.mergingOrderId}`);
      this.refresh();
      this.displayMergeDialog = false;
    }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  resetMergeForm(form: NgForm) {
    form.resetForm();
    this.mergingOrderId = null;
  }

  moveToOtherOrder(i) {
    let moved = this.splittingOrder.orderItems.splice(i, 1);
    this.splittingOtherOrderItems.push(...moved);
  }

  moveToMainOrder(i) {
    let moved = this.splittingOtherOrderItems.splice(i, 1);
    this.splittingOrder.orderItems.push(...moved);
  }

  split() {
    this.loading = true;
    this.dataService.split(this.splittingOrder.id, this.splittingOtherOrderItems.map(orderItem => orderItem.id))
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
      this.snackBarService.showSuccess(`Замовлення №${this.splittingOrder.id} успішно розділено`);
      this.refresh();
      this.displaySplitDialog = false;
    }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  resetSplitForm(form: NgForm) {
    form.resetForm();
    this.splittingOrder = null;
    this.splittingOtherOrderItems = [];
  }

  changeDiscount() {
    this.loading = true;
    this.dataService.changeDiscount(this.selected.id, this.orderDiscount * 100)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
        this.snackBarService.showSuccess(`Знижку для замовлення №${this.selected.id} успішно змінено`);
        this.refresh();
        this.displayDiscountChangeDialog = false;
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }


  resetDiscountChangeForm(form: NgForm) {
    this.orderDiscount = null;
    form.resetForm();
  }

  exportToExcel(id: number) {
    this.loading = true;
    this.dataService.exportToExcel(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe(response => {
        let fileName = response.headers.get('content-disposition').replace("attachment; filename=", "");
        fileSaver.saveAs(response.body, `Замовлення№${id}.xlsx`);
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  exportAllToExcel() {
    this.loading = true;
    this.dataService.exportAllToExcel(ngPrimeFiltersToParams(this.lastLazyLoadEvent.filters), new Pagination().fromPrimeNg(this.lastLazyLoadEvent))
      .pipe(finalize(() => this.loading = false))
      .subscribe(response => {
        fileSaver.saveAs(response.body, `СписокЗамовлень.xlsx`);
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  changeStatusToProcessingForAll() {
    this.loading = true;
    this.dataService.changeStatusToProcessingForAll(ngPrimeFiltersToParams(this.lastLazyLoadEvent.filters), new Pagination().fromPrimeNg(this.lastLazyLoadEvent))
      .pipe(finalize(() => this.loading = false))
      .subscribe(response => {
        this.snackBarService.showSuccess(`${response.body} замовленнь переведено в обробку`);
        this.refresh();
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  prepareProcessingBlank() {
    this.loading = true;
    this.dataService.prepareProcessingBlank(ngPrimeFiltersToParams(this.lastLazyLoadEvent.filters), new Pagination().fromPrimeNg(this.lastLazyLoadEvent))
      .pipe(finalize(() => this.loading = false))
      .subscribe(response => {
        fileSaver.saveAs(response.body, `БланкОбробкиЗамовлень.xlsx`);
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  sendOrderInEmail(orderId) {
    this.loading = true;
    this.dataService.sendToEmail(orderId)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
        this.snackBarService.showSuccess(`Замовлення №${orderId} успішно відправлено на електронну пошту замовника`);
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  zoomImage(image) {
    this.displayZoomDialog = true;
    this.zoomedImage = image;
  }

  resetZoomedImage() {
    this.zoomedImage = null;
  }

  onFlowerSizeFilter(event) {
    console.log(event)
  }
}


