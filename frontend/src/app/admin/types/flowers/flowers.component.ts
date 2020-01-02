import { Component, OnInit, ViewChild } from '@angular/core';
import { SnackBarService } from "../../../services/snak-bar.service";
import { Flower } from "../../../api/models/Flower";
import { FlowerService } from "../../../api/services/flower.service";
import { getErrorMessage, ngPrimeFiltersToParams } from "../../../utils/Functions";
import { ItemSaveMode } from "../../../models/ItemSaveMode";
import { ConfirmationService, SortEvent } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Pagination } from "../../../api/models/Pagination";
import { Table } from "primeng/table";
import { TranslationService } from "../../../utils/translation.service";
import { RestPage } from "../../../api/models/RestPage";
import { FlowerTypeService } from "../../../api/services/flower-type.service";


@Component({
  selector: 'flowers',
  templateUrl: './flowers.component.html',
  styleUrls: ['./flowers.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class FlowersComponent implements OnInit {

  @ViewChild('dt', { static: false }) private table: Table;

  ItemSaveMode = ItemSaveMode;

  dateFilters;

  sizeFilter: number[] = [1, 25];

  heightFilter: number[] = [15, 160];

  popularityFilter: number[] = [1, 10];

  imageUrl: string;
  isZoomed: boolean = false;

  flowerTypes = [];

  flowerSizeCols = [
    {field: 'size', header: 'Розмір'},
    {field: 'price', header: 'Ціна, грн'},
    {field: 'amount', header: 'Кількість'}
  ];

  columns = [
    {field: 'id', header: 'Id', active: true},
    {field: 'image', header: 'Фото', active: true},
    {field: 'name', header: 'Назва', active: true},
    {field: 'nameOriginal', header: 'Назва(англ)', active: false},
    {field: 'flowerType', header: 'Тип квітки', active: true},
    {field: 'groupName', header: 'Група', active: false},
    {field: 'flowerSizeMin', header: 'Розмір', active: true},
    {field: 'flowerHeightMin', header: 'Висота', active: true},
    {field: 'isNew', header: 'Новинка', active: false},
    {field: 'isPopular', header: 'Популярна', active: false},
    {field: 'popularity', header: 'Рейтинг', active: true},
    {field: 'color', header: 'Колір', active: true},
    {field: 'created', header: 'Створено', active: false}
  ];

  selectedColumns = this.columns.filter(column => column.active);

  items: RestPage<Flower> = new RestPage<Flower>();
  selected: Flower;

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
      label: 'Видалити',
      icon: 'fa fa-fw fa-trash',
      command: (event) => this.confirmRemove(event)
    },
  ];

  constructor(private dataService: FlowerService,
              private flowerTypeService: FlowerTypeService,
              private snackBarService: SnackBarService,
              private confirmationService: ConfirmationService,
              private router: Router,
              private translation: TranslationService,
              private route: ActivatedRoute) {
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

  mapForFilter = item => {
    return {
      label: item.name,
      value: item.id
    };
  };

  filter(value, filed) {
    console.log(value, filed)
  }

  remove(event) {
    this.dataService.delete(this.selected.id).subscribe(
      response => {
        this.snackBarService.showSuccess("'Квітку' успішно видалено");
        this.refresh();
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  confirmRemove(event) {
    this.confirmationService.confirm({
      message: "Ви впевнені що хочете видалити данну 'Квітку'?",
      accept: () => {
        this.remove(event)
      }
    });
  }

  sortData(event: SortEvent) {
      event.data.sort((data1, data2) => {
        let value1, value2;
        if (event.field == 'flowerSizeMin' && event.order == -1) {
           value1 = data1['flowerSizeMax'];
           value2 = data2['flowerSizeMax'];
        } else if (event.field == 'flowerHeightMin' && event.order == -1){
           value1 = data1['flowerHeightMax'];
           value2 = data2['flowerHeightMax'];
        } else {
          value1 = data1[event.field];
          value2 = data2[event.field];
        }

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

  zoomImg(imageUrl) {
    this.imageUrl = imageUrl;
    this.isZoomed = true;
  }

  closeImg() {
    this.isZoomed = false;
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


