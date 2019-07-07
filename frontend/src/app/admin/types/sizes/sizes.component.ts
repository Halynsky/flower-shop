import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../services/snak-bar.service";
import { SizeService } from "../../../api/services/size.service";
import { Size, SizeAdmin } from "../../../api/models/Size";
import { ConfirmationService, MenuItem } from "primeng/api";
import { getErrorMessage } from "../../../utils/Functions";
import { ItemSaveMode } from "../../../models/ItemSaveMode";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;

  cols = [
    { field: 'id', header: 'Id' },
    { field: 'name', header: 'Назва' },
    { field: 'flowersCount', header: 'Кількість квітів' },
  ];

  items: SizeAdmin[] = [];
  selected: SizeAdmin;

  menuItems = [
    { label: 'Редагувати',
      icon: 'fa fa-fw fa-pencil',
      command: () => this.router.navigate(['item', ItemSaveMode.edit], {relativeTo: this.route, queryParams: {id: this.selected.id}})},
    { label: 'Видалити',
      icon: 'fa fa-fw fa-trash',
      command: (event) => this.confirmRemove(event)},
  ];

  constructor(private dataService: SizeService,
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

  edit(event) {
    console.log(this.selected);
    console.log(event);
  }

  remove(event) {
    this.dataService.delete(this.selected.id).subscribe(
      response => {
        this.snackBarService.showSuccess("Розмір успішно видалено");
        this.loadData();
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  confirmRemove(event) {
      if (this.selected.flowersCount > 0) {
        return this.snackBarService.showWarning("Видалення Розміру який привязаний до квітів не можливе")
      }

      this.confirmationService.confirm({
        message: 'Ви впевнені що хочете видалити данний Розмір?',
        accept: () => {
          this.remove(event)
        }
      });
  }

}
