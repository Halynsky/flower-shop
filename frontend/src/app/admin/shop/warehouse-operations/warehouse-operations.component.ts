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
  selector: 'warehouse',
  templateUrl: './warehouse-operations.component.html',
  styleUrls: ['./warehouse-operations.component.scss']
})
export class WarehouseOperationsComponent implements OnInit {

  @ViewChild('dt', { static: false }) private table: Table;

  ItemSaveMode = ItemSaveMode;
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
    {field: 'isActive', header: 'Дійсна', active: true},
    {field: 'date', header: 'Дата', active: true},
    {field: 'operationType', header: 'Операція', active: true},
    {field: 'direction', header: 'Прихід/Відхід', active: true},
  ];

  selectedColumns = this.columns.filter(column => column.active);

  items: RestPage<WarehouseOperation> = new RestPage<WarehouseOperation>();
  selected: WarehouseOperation;

  menuItems = [
    { label: 'Відмінити',
      icon: 'fa fa-fw fa-trash',
      command: (event) => this.confirmRemove(event)},
  ];

  constructor(private dataService: WarehouseOperationService,
              private snackBarService: SnackBarService,
              private confirmationService: ConfirmationService,
              private router: Router,
              private route: ActivatedRoute,
              public translation: TranslationService,
              public enumToObjectsPipe: EnumToObjectsPipe) {
    this.directionOptions = enumToObjectsPipe.transform(WarehouseOperationType.Direction);
    this.directionOptions.forEach(e => e.label = translation.text.directions[e.label]);
    this.operationTypes = enumToObjectsPipe.transform(WarehouseOperationType.OperationType);
    this.operationTypes.forEach(e => e.label = translation.text.operationTypes[e.label]);

  }

  ngOnInit() {

  }

  loadDataLazy(filters = {}, pagination: Pagination = new Pagination()) {
    this.dataService.getAll(filters, pagination).subscribe(
      items => this.items = items,
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onLazyLoad(event: any) {
    this.loadDataLazy(ngPrimeFiltersToParams(event.filters), new Pagination().fromPrimeNg(event));
  }

  refresh(): void {
    this.table.onLazyLoad.emit(this.table.createLazyLoadMetadata());
  }

  confirmRemove(event) {
    if (this.selected.isActive) {
      this.confirmationService.confirm({
        message: "Ви впевнені що хочете відмінити данну 'Складську операцію'?",
        accept: () => {
          this.remove(event)
        }
      });
    } else {
      this.snackBarService.showError("Ви не можете відмінити не дійсну 'Складську операцію'")
    }

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
