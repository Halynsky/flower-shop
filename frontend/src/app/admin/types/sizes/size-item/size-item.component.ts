import { Component, OnInit } from '@angular/core';
import { Size } from "../../../../api/models/Size";
import { SizeService } from "../../../../api/services/size.service";
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage } from "../../../../utils/Functions";
import { ItemSaveMode } from '../../../../models/ItemSaveMode';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'size-item',
  templateUrl: './size-item.component.html',
  styleUrls: ['./size-item.component.scss']
})
export class SizeItemComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;
  item: Size = new Size();
  previousName;

  loading = false;
  isLoaded = true;

  constructor(public dataService: SizeService,
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
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  add() {
    this.loading = true;
    this.dataService.add(this.item)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      response => {
        this.snackBarService.showSuccess("Розмір успішно створено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  update() {
    this.loading = true;
    this.dataService.update(this.item.id, this.item)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      response => {
        this.snackBarService.showSuccess("Розмір успішно оновлено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onSubmit() {
    this.mode == ItemSaveMode.new ? this.add() : this.update()
  }

}
