import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Table } from "primeng";
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
import { IdAmountTuple } from "../../../api/models/IdAmountTuple";
import { FlowerSize } from "../../../api/models/FlowerSize";
import { FlowerSizeService } from "../../../api/services/flower-size.service";
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  @ViewChild('dt', { static: false }) private table: Table;
  displayStatusChangeDialog = false;
  displayContactsChangeDialog = false;
  displayNoteChangeDialog = false;
  displayMergeDialog = false;
  displaySplitDialog = false;
  displayUpdateOrderItemsDialog = false;
  displayDiscountChangeDialog = false;
  displayPaymentConfirmDialog = false;

  loading = false;

  ItemSaveMode = ItemSaveMode;

  columns = [
    {field: 'id', header: 'Id', active: true},
    {field: 'created', header: 'Дата створення', active: true},
    {field: 'closed', header: 'Дата закриття', active: false},
    {field: 'status', header: 'Статус', active: true},
    {field: 'userId', header: 'Корист.Id', active: true},
    {field: 'user', header: 'Корист.', active: true},
    {field: 'userFacebookNickname', header: 'Нік на Facebook', active: true},
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

  selectedColumns = this.columns.filter(column => column.active);

  items: RestPage<OrderAdmin> = new RestPage<OrderAdmin>();
  flowerSizes: FlowerSize[];

  statusesOptions = [];
  Status = Order.Status;

  createdFilters;
  closedFilters;

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
  flowerSizeToAdd: FlowerSize;
  orderDiscount;
  paymentDate;

  lastLazyLoadEvent;

  constructor(private dataService: OrderService,
              private flowerSizeService: FlowerSizeService,
              private snackBarService: SnackBarService,
              public translation: TranslationService,
              public enumToObjectsPipe: EnumToObjectsPipe,
              private router: Router,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef) {
    this.statusesOptions = enumToObjectsPipe.transform(Order.Status);
    this.statusesOptions.forEach(e => e.label = translation.text.orderStatuses[e.label]);
  }

  ngOnInit() {
  }

  loadDataLazy(filters = {}, pagination: Pagination = new Pagination()) {
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

  getAllFlowerSizes() {
    this.flowerSizeService.getAllForAdminAsList().subscribe(
      flowerSizes => this.flowerSizes = flowerSizes,
      error => this.snackBarService.showError(getErrorMessage(error))
    )
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
          this.paymentDate = this.selected.paymentDate;
        },
        visible: !this.orderIsClosed(this.selected.status) && !this.selected.isPaid,
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
          this.displayUpdateOrderItemsDialog = true;
          this.updatingOrder = clone(this.selected);
          this.getAllFlowerSizes();
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
        label: "Перейти до користувача",
        icon: 'fas fa-user-tag',
        command: (event) => this.foo(event),
        visible: this.selected.user,
      },
    ];
  }

  onContextMenuSelect(event) {
    this.selected = clone(event.data);
    this.initContextMenu();
    this.isContextMenuOpened = true;
  }

  onContextMenuHide(event) {
    this.isContextMenuOpened = false;
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

  confirmPayment() {
    this.loading = true;
    console.log(this.paymentDate);
    this.dataService.confirmPayment(this.selected.id, this.paymentDate)
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

  updateOrderItems() {
    this.loading = true;
    this.dataService.updateOrderItems(this.updatingOrder.id, this.updatingOrder.orderItems.map(orderItem => new IdAmountTuple(orderItem.flowerSizeId, orderItem.amount)))
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
        this.snackBarService.showSuccess(`Замовлення №${this.updatingOrder.id} успішно оновлено`);
        this.refresh();
        this.displayUpdateOrderItemsDialog = false;
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  resetUpdateOrderItemsForm(form: NgForm) {
    this.updatingOrder = null;
    this.flowerSizes = null;
    form.resetForm();
  }

  removeOrderItem(index) {
    let removedOrderItem = this.updatingOrder.orderItems.splice(index, 1)[0];
    let foundFlowerSize = this.flowerSizes.find(item => item.id == removedOrderItem.flowerSizeId);
    foundFlowerSize.reserved -= removedOrderItem.amount;
    foundFlowerSize.available += removedOrderItem.amount;
  }

  addOrderItem() {

    if (this.flowerSizeToAdd && this.flowerSizeToAdd.available > 0) {
      let found = this.updatingOrder.orderItems.find(item => item.flowerSizeId == this.flowerSizeToAdd.id);

      if (found) {
        found.amount++;
      } else {
        let orderItemAdmin: OrderItemAdmin = new OrderItemAdmin();
        orderItemAdmin.amount = 1;
        orderItemAdmin.flowerSizeId = this.flowerSizeToAdd.id;
        orderItemAdmin.image = this.flowerSizeToAdd.flower.image;
        orderItemAdmin.available =  this.flowerSizeToAdd.available;
        orderItemAdmin.name = this.flowerSizeToAdd.flower.name;
        orderItemAdmin.sizeName = this.flowerSizeToAdd.size.name;
        orderItemAdmin.price = this.flowerSizeToAdd.price;
        this.updatingOrder.orderItems.push(orderItemAdmin)
      }

      this.flowerSizeToAdd.reserved++;
      this.flowerSizeToAdd.available--;

    }

  }

  minusAmount(index) {
    let flowerSize = this.flowerSizes.find(item => item.id == this.updatingOrder.orderItems[index].flowerSizeId);

    if(this.updatingOrder.orderItems[index].amount > 1) {
      this.updatingOrder.orderItems[index].amount--;
      flowerSize.reserved--;
      flowerSize.available++;
    }
  }

  plusAmount(index) {
    let flowerSize = this.flowerSizes.find(item => item.id == this.updatingOrder.orderItems[index].flowerSizeId);
    if (flowerSize.available > 0) {
      this.updatingOrder.orderItems[index].amount++;
      flowerSize.reserved++;
      flowerSize.available--;
    }
  }

  onAmountModelChange(event, orderItem: OrderItemAdmin) {
    let difference = event - orderItem.amount;
    let foundFlowerSize = this.flowerSizes.find(item => item.id == orderItem.flowerSizeId);
    foundFlowerSize.available = foundFlowerSize.available - difference;
    foundFlowerSize.reserved = foundFlowerSize.reserved + difference;
  }

  getMaxForFlowerSize(orderItem: OrderItemAdmin) {
    let foundFlowerSize = this.flowerSizes.find(item => item.id == orderItem.flowerSizeId);
    return parseInt(orderItem.amount as any) + parseInt(foundFlowerSize.available as any);
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

  private exportToExcel(id: number) {
    this.loading = true;
    this.dataService.exportToExcel(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe(response => {
        let fileName = response.headers.get('content-disposition').replace("attachment; filename=", "");
        fileSaver.saveAs(response.body, `Замовлення№${id}.xlsx`);
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  private exportPageToExcel() {
    this.loading = true;
    this.dataService.exportPageToExcel(ngPrimeFiltersToParams(this.lastLazyLoadEvent.filters), new Pagination().fromPrimeNg(this.lastLazyLoadEvent))
      .pipe(finalize(() => this.loading = false))
      .subscribe(response => {
        fileSaver.saveAs(response.body, `СписокЗамовлень.xlsx`);
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

}


