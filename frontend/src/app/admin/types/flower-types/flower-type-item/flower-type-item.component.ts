import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage } from "../../../../utils/Functions";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";
import { FlowerTypeService } from "../../../../api/services/flower-type.service";
import { FlowerType } from "../../../../api/models/FlowerType";

@Component({
  selector: 'flower-type-item',
  templateUrl: './flower-type-item.component.html',
  styleUrls: ['./flower-type-item.component.scss']
})
export class FlowerTypeItemComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;
  previousName;

  item: FlowerType = new FlowerType();

  constructor(private dataService: FlowerTypeService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe(
      params => {
        this.mode = params['mode'];

        if (this.mode == ItemSaveMode.edit) {
          this.route.queryParams.subscribe(queryParams  => {
            if (queryParams['id'])
              this.getItem(queryParams['id'])
          })
        }

      }
    )

  }

  ngOnInit() {
  }

  getItem(id) {
    this.dataService.getById(id).subscribe(
      item => {
        this.item = item;
        this.previousName = item.name;
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  add() {
    this.dataService.add(this.item).subscribe(
      response => {
        this.snackBarService.showSuccess("Тип квітів успішно створено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  update() {
    this.dataService.update(this.item.id, this.item).subscribe(
      response => {
        this.snackBarService.showSuccess("Тип квітів успішно оновлено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onSubmit() {
    this.mode == ItemSaveMode.new ? this.add() : this.update()
  }

}
