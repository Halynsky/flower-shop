import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from "primeng/table";
import { RestPage } from "../../api/models/RestPage";
import { UserForAdmin } from "../../api/models/User";
import { ItemSaveMode } from "../../models/ItemSaveMode";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage, ngPrimeFiltersToParams } from "../../utils/Functions";
import { UserService } from "../../api/services/user.service";
import { ConfirmationService, FilterMetadata, SortEvent } from "primeng/api";
import { SnackBarService } from "../../services/snak-bar.service";
import { Pagination } from "../../api/models/Pagination";
import { NgForm } from "@angular/forms";
import { finalize } from "rxjs/operators";
import { dataTableFilter } from "../util";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild('dt', { static: false }) private table: Table;

  displayMergeDialog = false;
  displayNoteChangeDialog = false;
  ItemSaveMode = ItemSaveMode;
  loading = false;

  cols = [
    {field: 'id', header: 'Id', active: true},
    {field: 'name', header: 'Імя', active: true},
    {field: 'email', header: 'Email', active: true},
    {field: 'phone', header: 'Телефон', active: true},
    {field: 'role', header: 'Роль', active: false},
    {field: 'isEnabled', header: 'Розблокований', active: false},
    {field: 'isVirtual', header: 'Віртуальний', active: true},
    {field: 'isActivated', header: 'Активований', active: false},
    {field: 'created', header: 'Дата реєстрації', active: false},
    {field: 'lastOrderDate', header: 'Остання покупка', active: true},
    {field: 'note', header: 'Примітка', active: true},
    {field: 'facebookNickname', header: 'Нік на Facebook', active: true},
  ];

  selectedColumns = this.cols.filter(column => column.active);

  items: RestPage<UserForAdmin> = new RestPage<UserForAdmin>();
  selected: UserForAdmin;

  menuItems = [];

  mergingUserId;
  userNote;

  filters: { [s: string]: FilterMetadata } = {};

  constructor(private dataService: UserService,
              private confirmationService: ConfirmationService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute) {
    this.initContextMenu();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      Object.assign(this.filters, dataTableFilter('id', params['id']));
    });
  }

  initContextMenu() {
    this.menuItems = [
      {
        label: 'Редагувати',
        icon: 'fa fa-fw fa-pencil',
        command: () => this.router.navigate(['item', ItemSaveMode.edit], {
          relativeTo: this.route,
          queryParams: {id: this.selected.id}
        })
      },
      {
        label: 'Переглянути замовлення',
        icon: 'fas fa-shopping-basket',
        command: () => this.router.navigate(['admin/shop/orders'], {queryParams: {userId: this.selected.id}})
      },
      {
        label: 'Заблокувати',
        icon: 'fas fa-ban',
        command: (event) => this.confirmDisable(event),
        visible: this.selected && this.selected.isEnabled
      },
      {
        label: 'Розблокувати',
        icon: 'fas fa-user-check',
        command: (event) => this.updateDisabled(event, false),
        visible: this.selected && !this.selected.isEnabled,
        styleClass: 'cm-danger',
      },
      {
        label: "Додати примітку",
        icon: 'fas fa-clipboard',
        command: (event) => {
          this.displayNoteChangeDialog = true;
          this.userNote = this.selected.note;
        }
      },
      {
        separator: true
      },
      {
        label: "Об'єднати користувачів",
        icon: 'fas fa-object-group',
        command: (event) => {
          this.displayMergeDialog = true;
        }
      },
    ];
  }

  loadDataLazy(filters = {}, pagination: Pagination = new Pagination()) {
    this.dataService.getForAdmin(filters, pagination).subscribe(
      items => this.items = items,
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onLazyLoad(event: any) {
    this.loadDataLazy(ngPrimeFiltersToParams(event.filters), new Pagination().fromPrimeNg(event));
  }

  confirmDisable(event) {
    this.confirmationService.confirm({
      message: "Ви впевнені що хочете заблокувати данного 'Користувача'?",
      accept: () => {
        this.updateDisabled(event, true)
      }
    });
  }

  updateDisabled(event, disabled) {
    this.dataService.updateDisabled(this.selected.id, disabled).subscribe(
      response => {
        if (disabled) {
          this.snackBarService.showSuccess("'Користувача' успішно заблоковано");
        } else {
          this.snackBarService.showSuccess("'Користувача' успішно розблоковано");
        }
        this.refresh();
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  refresh(): void {
    this.table.onLazyLoad.emit(this.table.createLazyLoadMetadata());
  }

  sortData(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];

      let result = null;
      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }

  onColumnSelect(event) {
    let changedColumn = this.cols.find(column => column.field == event.itemValue.field);
    changedColumn.active = !changedColumn.active;
    this.filterSelectedColumns()
  }

  filterSelectedColumns() {
    this.selectedColumns = this.cols.filter(column => column.active);
  }

  onRowSelect(event) {
    this.initContextMenu();
  }

  merge() {
    this.loading = true;
    this.dataService.merge(this.selected.id, this.mergingUserId)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
        this.snackBarService.showSuccess(`Користувача №${this.selected.id} об'єднано з користувачем №${this.mergingUserId}`);
        this.refresh();
        this.displayMergeDialog = false;
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  resetMergeForm(form: NgForm) {
    this.mergingUserId = null;
    form.resetForm();
  }

  changeNote() {
    this.loading = true;
    this.dataService.changeNote(this.selected.id, this.userNote)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
        this.snackBarService.showSuccess(`Примітку для користувача з Id - ${this.selected.id} успішно змінено`);
        this.refresh();
        this.displayNoteChangeDialog = false;
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

  resetNoteChangeForm(form: NgForm) {
    form.resetForm();
    this.userNote = null;
  }

}
