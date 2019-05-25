import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Color } from "../../../../api/models/Color";
import { ColorService } from "../../../../api/services/color.service";
import { getErrorMessage } from "../../../../utils/Functions";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";

@Component({
  selector: 'color-item',
  templateUrl: './color-item.component.html',
  styleUrls: ['./color-item.component.scss']
})
export class ColorItemComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;

  item: Color = new Color();

  constructor(private dataService: ColorService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe(
      params => {
        this.mode = params['mode'];
        if (params['id'])
          this.getItem(params['id']);

        this.route.queryParams.subscribe(queryParams  => {
          if (this.mode == ItemSaveMode.edit && queryParams['id'])
            this.getItem(queryParams['id'])
        })

      }
    )

  }

  ngOnInit() {
  }

  getItem(id) {
    this.dataService.getById(id).subscribe(
      item => this.item = item,
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  add() {
    this.dataService.add(this.item).subscribe(
      response => {
        this.snackBarService.showSuccess("Колір успішно створено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  update() {
    this.dataService.update(this.item.id, this.item).subscribe(
      response => {
        this.snackBarService.showSuccess("Колір успішно оновлено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onSubmit() {
    this.mode == ItemSaveMode.new ? this.add() : this.update()
  }

}
