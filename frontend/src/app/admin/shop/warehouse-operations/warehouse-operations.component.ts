import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemSaveMode } from "../../../models/ItemSaveMode";
import { ConfirmationService } from "primeng/api";
import { WarehouseOperation } from "../../../api/models/WarehouseOperation";
import { SnackBarService } from "../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { WarehouseOperationService } from "../../../api/services/warehouse-operation.service";
import { TranslationService } from "../../../utils/translation.service";
import { WarehouseOperationType } from "../../../api/models/WarehouseOperationType";
import { Table } from "primeng/table";
import { EnumToObjectsPipe } from "../../../pipes/enum-to-objects";
import { getErrorMessage, ngPrimeFiltersToParams } from "../../../utils/Functions";
import { Pagination } from "../../../api/models/Pagination";
import { RestPage } from "../../../api/models/RestPage";

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse-operations.component.html',
  styleUrls: ['./warehouse-operations.component.scss']
})
export class WarehouseOperationsComponent implements OnInit {

  @ViewChild('dt') private table: Table;

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;

  WarehouseOperationType = WarehouseOperationType;
  directionOptions = [];
  operationTypes = [];

  dateFilters;
  amountMin = 1;
  amountMax = 10000;
  amountFilter = [this.amountMin, this.amountMax];

  columns = [
    {field: 'id', header: 'Id', active: true},
    {field: 'flowerType', header: 'Тип', active: true},
    {field: 'flower', header: 'Назва', active: true},
    {field: 'size', header: 'Розмір', active: true},
    {field: 'amount', header: 'Кількість', active: true},
    {field: 'date', header: 'Дата', active: true},
    {field: 'operationType', header: 'Операція', active: true},
    {field: 'direction', header: 'Прихід/Відхід', active: true},
  ];

  selectedColumns = this.columns.filter(column => column.active);

  items: RestPage<WarehouseOperation> = new RestPage<WarehouseOperation>();
  selected: WarehouseOperation;

  menuItems = [
    { label: 'Редагувати',
      icon: 'fa fa-fw fa-pencil',
      command: () => this.router.navigate(['item', ItemSaveMode.edit], {relativeTo: this.route, queryParams: {id: this.selected.id}})},
    { label: 'Видалити',
      icon: 'fa fa-fw fa-trash',
      command: (event) => this.confirmRemove(event)},
  ];

  constructor(private dataService: WarehouseOperationService,
              private snackBarService: SnackBarService,
              private confirmationService: ConfirmationService,
              private router: Router,
              private route: ActivatedRoute,
              private translation: TranslationService,
              private enumToObjectsPipe: EnumToObjectsPipe) {
    this.directionOptions = enumToObjectsPipe.transform(WarehouseOperationType.Direction);
    this.directionOptions.forEach(e => e.label = translation.text[e.label]);
    this.operationTypes = enumToObjectsPipe.transform(WarehouseOperationType.OperationType);
    this.operationTypes.forEach(e => e.label = translation.text[e.label]);

  }

  ngOnInit() {

  }

  loadDataLazy(filters = {}, pagination: Pagination = new Pagination()) {
    this.dataService.getAll(filters, pagination).subscribe(
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

  confirmRemove(event) {
    this.confirmationService.confirm({
      message: "Ви впевнені що хочете видалити данну 'Складську операцію'?",
      accept: () => {
        this.remove(event)
      }
    });
  }

  remove(event) {
    this.dataService.delete(this.selected.id).subscribe(
      response => {
        this.snackBarService.showSuccess("'Складську операцію' успішно видалено");
        this.refresh();
      },
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



}
