import {Component, OnInit} from '@angular/core';
import {SnackBarService} from "../../../services/snak-bar.service";
import {Flower} from "../../../api/models/Flower";
import {FlowerService} from "../../../api/services/flower.service";
import {getErrorMessage} from "../../../utils/Functions";
import {ItemSaveMode} from "../../../models/ItemSaveMode";
import {ConfirmationService, SortEvent} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";


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

  ItemSaveMode = ItemSaveMode;

  sizeTimeout: any;
  sizeFilter: number[] = [1, 25];

  heightTimeout: any;
  heightFilter: number[] = [15, 160];

  popularityTimeout: any;
  popularityFilter: number[] = [1, 10];

  imageUrl: string;
  isZoomed: boolean = false;

  cols = [
    {field: 'id', header: 'Id', active: true},
    {field: 'name', header: 'Назва', active: true},
    {field: 'nameOriginal', header: 'Назва(англ)', active: true},
    {field: 'flowerType', header: 'Тип квітки', active: true},
    {field: 'groupName', header: 'Група', active: true},
    {field: 'flowerSizeMin', header: 'Розмір', active: true},
    {field: 'flowerHeightMin', header: 'Висота', active: true},
    {field: 'isNew', header: 'Новинка', active: true},
    {field: 'hasDiscount', header: 'Знижка', active: true},
    {field: 'isPopular', header: 'Популярна', active: true}
  ];

  selectedColumns = this.cols.filter(column => column.active);

  items: Flower[] = [];
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
              private snackBarService: SnackBarService,
              private confirmationService: ConfirmationService,
              private router: Router,
              private route: ActivatedRoute) {
    this.loadData();

  }

  ngOnInit() {
    this.selectedColumns = this.cols;
  }

  loadData() {
    this.dataService.getForAdmin().subscribe(
      items => this.items = items,
      error => this.snackBarService.showError(error.error.message)
    )
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
        this.loadData();
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

  onSizeChange(event, dt, isSize) {
    console.log(event)
    if (isSize){
      if (this.sizeTimeout) {
        clearTimeout(this.sizeTimeout);
      }

      this.sizeTimeout = setTimeout(() => {
        dt.filter(event.values[0]-1, 'flowerSizeMin', 'gt');
        dt.filter(event.values[1], 'flowerSizeMax', 'lte');
      }, 250);
    } else {

      if (this.heightTimeout) {
        clearTimeout(this.heightTimeout);
      }

      this.heightTimeout = setTimeout(() => {
        dt.filter(event.values[0]-1, 'flowerHeightMin', 'gt');
        dt.filter(event.values[1], 'flowerHeightMax', 'lte');
      }, 250);
    }
  }

  onPopularityChange(event, dt) {
    if (this.popularityTimeout) {
      clearTimeout(this.popularityTimeout);
    }

    this.popularityTimeout = setTimeout(() => {
      dt.filter(event.value, 'popularity', 'gt');
    }, 250);
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
    let changedColumn = this.cols.find(column => column.field == event.itemValue.field);
    changedColumn.active = !changedColumn.active;
    this.filterSelectedColumns()
  }

  filterSelectedColumns() {
    this.selectedColumns = this.cols.filter(column => column.active);
  }

}


