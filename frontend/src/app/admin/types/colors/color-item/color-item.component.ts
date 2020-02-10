import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Color } from "../../../../api/models/Color";
import { ColorService } from "../../../../api/services/color.service";
import { getErrorMessage } from "../../../../utils/Functions";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'color-item',
  templateUrl: './color-item.component.html',
  styleUrls: ['./color-item.component.scss']
})
export class ColorItemComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;

  item: Color = new Color();
  previousName;
  previousColor;

  isLoaded = true;
  loading = false;

  constructor(public dataService: ColorService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe(
      params => {
        this.mode = params['mode'];

        if (this.mode == ItemSaveMode.edit) {
          this.isLoaded = false;
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
    this.dataService.getById(id)
      .pipe(finalize(() => this.isLoaded = true ))
      .subscribe(
      item => {
        this.item = item;
        this.previousName = item.name;
        this.previousColor = item.hex;
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  add() {
    this.loading = true;
    this.dataService.add(this.item)
      .subscribe(
      response => {
        this.snackBarService.showSuccess("Колір успішно створено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  update() {
    this.loading = true;
    this.dataService.update(this.item.id, this.item)
      .subscribe(
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
