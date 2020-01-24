import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { ConfirmationService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { ItemSaveMode } from "../../../models/ItemSaveMode";
import { GroupAdmin } from "../../../api/models/Group";
import { GroupService } from "../../../api/services/group.service";
import { FlowerTypeService } from "../../../api/services/flower-type.service";

@Component({
  selector: 'groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;
  items: GroupAdmin[] = [];
  selected: GroupAdmin;

  flowerTypes = [];

  cols = [
    { field: 'id', header: 'Id' },
    { field: 'name', header: 'Назва' },
    { field: 'nameSingle', header: 'Назва (одн)' },
    { field: 'nameOriginal', header: 'Назва (англ)' },
    { field: 'nameOriginalSingle', header: 'Назва (англ.одн)' },
    { field: 'flowerType', header: 'Тип Квітів' },
    { field: 'flowersCount', header: 'Кількість квітів' },
  ];

  menuItems = [
    { label: 'Редагувати',
      icon: 'fa fa-fw fa-pencil',
      command: () => this.router.navigate(['item', ItemSaveMode.edit], {relativeTo: this.route, queryParams: {id: this.selected.id}})},
    { label: 'Видалити',
      icon: 'fa fa-fw fa-trash',
      command: (event) => this.confirmRemove(event)},
  ];

  constructor(private dataService: GroupService,
              private flowerTypeService: FlowerTypeService,
              private snackBarService: SnackBarService,
              private confirmationService: ConfirmationService,
              private router: Router,
              private route: ActivatedRoute) {
    this.getFlowerTypes();
    this.loadData();
  }

  ngOnInit() {
  }

  loadData() {
    this.dataService.getForAdmin().subscribe(
      items => this.items = items,
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  getFlowerTypes() {
    this.flowerTypeService.getAll().subscribe(flowerTypes => {
        this.flowerTypes = flowerTypes.map(flowerType => { return {value: flowerType.name, label: flowerType.name}})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  remove(event) {
    this.dataService.delete(this.selected.id).subscribe(
      response => {
        this.snackBarService.showSuccess("'Групу' успішно видалено");
        this.loadData();
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  confirmRemove(event) {
    if (this.selected.flowersCount > 0) {
      return this.snackBarService.showWarning("Видалення 'Групи' якиа привязаний до квітів не можливе")
    }

    this.confirmationService.confirm({
      message: "Ви впевнені що хочете видалити данний 'Групу'?",
      accept: () => {
        this.remove(event)
      }
    });
  }

}
