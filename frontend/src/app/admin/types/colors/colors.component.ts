import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../services/snak-bar.service";
import { ColorAdmin } from "../../../api/models/Color";
import { ColorService } from "../../../api/services/color.service";
import { getErrorMessage } from "../../../utils/Functions";
import { ConfirmationService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { ItemSaveMode } from "../../../models/ItemSaveMode";

@Component({
  selector: 'colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;

  cols = [
    { field: 'id', header: 'Id' },
    { field: 'name', header: 'Назва' },
    { field: 'flowersCount', header: 'Кількість квітів' },
    { field: 'hex', header: 'Hex' },
    { field: 'example', header: 'Приклад' }
  ];

  items: ColorAdmin[] = [];
  selected: ColorAdmin;

  menuItems = [
    { label: 'Редагувати',
      icon: 'fa fa-fw fa-pencil',
      command: () => this.router.navigate(['item', ItemSaveMode.edit], {relativeTo: this.route, queryParams: {id: this.selected.id}})},
    { label: 'Видалити',
      icon: 'fa fa-fw fa-trash',
      command: (event) => this.confirmRemove(event)},
  ];

  constructor(private dataService: ColorService,
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
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  remove(event) {
    this.dataService.delete(this.selected.id).subscribe(
      response => {
        this.snackBarService.showSuccess("'Колір' успішно видалено");
        this.loadData();
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  confirmRemove(event) {
    if (this.selected.flowersCount > 0) {
      return this.snackBarService.showWarning("Видалення 'Кольору' який привязаний до квітів не можливе")
    }

    this.confirmationService.confirm({
      message: "Ви впевнені що хочете видалити данний 'Колір'?",
      accept: () => {
        this.remove(event)
      }
    });
  }

}
