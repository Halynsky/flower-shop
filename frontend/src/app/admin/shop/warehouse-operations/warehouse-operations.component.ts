import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemSaveMode } from "../../../models/ItemSaveMode";
import { ConfirmationService } from "primeng/api";
import { WerehouseOperation } from "../../../api/models/WerehouseOperation";
import { SnackBarService } from "../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { WerehouseOperationService } from "../../../api/services/werehouse-operation.service";
import { TranslationService } from "../../../utils/translation.service";
import { WerehouseOperationType } from "../../../api/models/WerehouseOperationType";
import { Table } from "primeng/table";
import { RangePipe } from "angular-pipes";
import { EnumToObjectsPipe } from "../../../pipes/enum-to-objects";
import { getErrorMessage } from "../../../utils/Functions";

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse-operations.component.html',
  styleUrls: ['./warehouse-operations.component.scss']
})
export class WarehouseOperationsComponent implements OnInit {

  @ViewChild('dt') private table: Table;

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;

  WerehouseOperationType = WerehouseOperationType;
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

  items: WerehouseOperation[] = [];
  selected: WerehouseOperation;

  menuItems = [
    { label: 'Редагувати',
      icon: 'fa fa-fw fa-pencil',
      command: () => this.router.navigate(['item', ItemSaveMode.edit], {relativeTo: this.route, queryParams: {id: this.selected.id}})},
    { label: 'Видалити',
      icon: 'fa fa-fw fa-trash',
      command: (event) => this.confirmRemove(event)},
  ];

  constructor(private dataService: WerehouseOperationService,
              private snackBarService: SnackBarService,
              private confirmationService: ConfirmationService,
              private router: Router,
              private route: ActivatedRoute,
              private translation: TranslationService,
              private enumToObjectsPipe: EnumToObjectsPipe,
              public rangePipe: RangePipe) {
    this.loadData();
    this.directionOptions = enumToObjectsPipe.transform(WerehouseOperationType.Direction);
    this.directionOptions.forEach(e => e.label = translation.text[e.label]);
    this.operationTypes = enumToObjectsPipe.transform(WerehouseOperationType.OperationType);
    this.operationTypes.forEach(e => e.label = translation.text[e.label]);
  }

  ngOnInit() {
    this.table.filterConstraints['dateRangeFilter'] = (value, filter): boolean => {
      return true
    }

  }

  loadData() {
    this.dataService.getAll().subscribe(
      items => this.items = items,
      error => this.snackBarService.showError(error.error.message)
    )
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
        this.loadData();
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

  loadDataOnScroll(event: any) {
    console.log(event)
  }

}
