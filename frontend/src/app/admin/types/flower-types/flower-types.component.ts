import { Component, OnInit } from '@angular/core';
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { FlowerType } from "../../../api/models/FlowerType";
import { SnackBarService } from "../../../services/snak-bar.service";
import { ItemSaveMode } from "../../../models/ItemSaveMode";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage } from "../../../utils/Functions";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'flower-types',
  templateUrl: './flower-types.component.html',
  styleUrls: ['./flower-types.component.scss']
})
export class FlowerTypesComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;

  cols = [
    {field: 'id', header: 'Id'},
    {field: 'name', header: 'Назва'},
    {field: 'nameSingle', header: 'Назва(однина)'},
    {field: 'flowersCount', header: 'Кількість Квітів'},
  ];

  items: FlowerType[] = [];
  selected: FlowerType;

  menuItems = [
    { label: 'Редагувати',
      icon: 'fa fa-fw fa-pencil',
      command: () => this.router.navigate(['item', ItemSaveMode.edit], {relativeTo: this.route, queryParams: {id: this.selected.id}})},
    { label: 'Видалити',
      icon: 'fa fa-fw fa-trash',
      command: (event) => this.confirmRemove(event)},
  ];

  constructor(private dataService: FlowerTypeService,
              private snackBarService: SnackBarService,
              private confirmationService: ConfirmationService,
              private router: Router,
              private route: ActivatedRoute) {
    this.loadData()
  }

  ngOnInit() {
  }

  loadData() {
    this.dataService.getAll().subscribe(
      items => this.items = items,
      error => this.snackBarService.showError(error.error.message)
    )
  }

  remove(event) {
    this.dataService.delete(this.selected.id).subscribe(
      response => {
        this.snackBarService.showSuccess("'Тип Квітів' успішно видалено");
        this.loadData();
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  confirmRemove(event) {
    if (this.selected.flowersCount > 0) {
      return this.snackBarService.showWarning("Видалення 'Типу Квітів' який привязаний до квітів не можливе")
    }

    this.confirmationService.confirm({
      message: "Ви впевнені що хочете видалити данний 'Тип Квітів'?",
      accept: () => {
        this.remove(event)
      }
    });
  }

}


