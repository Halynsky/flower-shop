import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from "primeng/table";
import { RestPage } from "../../api/models/RestPage";
import { UserForAdmin } from "../../api/models/User";
import { ItemSaveMode } from "../../models/ItemSaveMode";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage, ngPrimeFiltersToParams } from "../../utils/Functions";
import { UserService } from "../../api/services/user.service";
import { ConfirmationService, SortEvent } from "primeng/api";
import { SnackBarService } from "../../services/snak-bar.service";
import { Pagination } from "../../api/models/Pagination";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild('dt') private table: Table;

  ItemSaveMode = ItemSaveMode;

  cols = [
    {field: 'id', header: 'Id', active: true},
    {field: 'name', header: 'Імя', active: true},
    {field: 'email', header: 'Email', active: true},
    {field: 'phone', header: 'Телефон', active: true},
    {field: 'role', header: 'Роль', active: true},
    {field: 'isEnabled', header: 'Розблокований', active: true},
    {field: 'isVirtual', header: 'Віртуальний', active: true},
    {field: 'isActivated', header: 'Активований', active: true},
    {field: 'created', header: 'Дата реєстрації', active: true},
  ];

  selectedColumns = this.cols.filter(column => column.active);

  items: RestPage<UserForAdmin> = new RestPage<UserForAdmin>();
  selected: UserForAdmin;

  menuItems = [
    {
      label: 'Редагувати',
      icon: 'fa fa-fw fa-pencil',
      command: () => this.router.navigate(['item', ItemSaveMode.edit], {
        relativeTo: this.route,
        queryParams: {id: this.selected.id}
      })
    },
    {
      label: 'Заблокувати',
      icon: 'fas fa-ban',
      command: (event) => this.confirmDisable(event)
    },
  ];

  constructor(private dataService: UserService,
              private confirmationService: ConfirmationService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
  }

  loadDataLazy(filters = {}, pagination: Pagination = new Pagination()) {
    this.dataService.getForAdmin(filters, pagination).subscribe(
      items => this.items = items,
      error => this.snackBarService.showError(error.error.message)
    )
  }

  onLazyLoad(event: any) {
    this.loadDataLazy(ngPrimeFiltersToParams(event.filters), new Pagination().fromPrimeNg(event));
  }

  confirmDisable(event) {
    this.confirmationService.confirm({
      message: "Ви впевнені що хочете заблокувати данного 'Користувача'?",
      accept: () => {
        this.disable(event)
      }
    });
  }

  disable(event) {
    this.dataService.updateDisabled(this.selected.id, true).subscribe(
      response => {
        this.snackBarService.showSuccess("'Користувача' успішно видалено");
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

}
