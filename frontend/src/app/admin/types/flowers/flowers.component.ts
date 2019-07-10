import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../services/snak-bar.service";
import { Flower } from "../../../api/models/Flower";
import { FlowerService } from "../../../api/services/flower.service";
import { getErrorMessage } from "../../../utils/Functions";
import { ItemSaveMode } from "../../../models/ItemSaveMode";
import { FlowerType } from "../../../api/models/FlowerType";
import { ConfirmationService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'flowers',
  templateUrl: './flowers.component.html',
  styleUrls: ['./flowers.component.scss']
})
export class FlowersComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;

  sizeTimeout: any;
  sizeFilter: number[] = [1, 25];

  heightTimeout: any;
  heightFilter: number[] = [15, 160];

  // cols = [
  //   {field: 'id', header: 'Id'},
  //   {field: 'name', header: 'Назва'},
  //   {field: 'nameOriginal', header: 'Назва(англ)'},
  //   {field: 'flowerType', header: 'Тип квітки'}
  // ];

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
    this.loadData()
  }

  ngOnInit() {
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
}


