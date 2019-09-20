import { Component, OnInit } from '@angular/core';
import { Size } from "../../../../api/models/Size";
import { SizeService } from "../../../../api/services/size.service";
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage } from "../../../../utils/Functions";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";

@Component({
  selector: 'size-item',
  templateUrl: './size-item.component.html',
  styleUrls: ['./size-item.component.scss']
})
export class SizeItemComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;

  minMaxError: boolean = false;

  item: Size = new Size();

  constructor(private dataService: SizeService,
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
      item => this.item = item,
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  add() {
    this.dataService.add(this.item).subscribe(
      response => {
        this.snackBarService.showSuccess("Розмір успішно створено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  update() {
    this.dataService.update(this.item.id, this.item).subscribe(
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

  onSizeChange() {

    if (this.item.min && this.item.max) {
      if (this.item.min < this.item.max) {
        this.item.name = `${this.item.min ? this.item.min : ''}/${this.item.max ? this.item.max : ''}`;
        this.minMaxError = false;
      } else {
        this.minMaxError = true;
      }
    }

    if (this.item.min && !this.item.max ) {
      this.item.name = `${this.item.min}/`;
      this.minMaxError = false;
    }

    if (!this.item.min && this.item.max ) {
      this.item.name = `${this.item.max}+`;
      this.minMaxError = false;
    }

    if (!this.item.min && !this.item.max) {
      this.item.name = '';
      this.minMaxError = false;
    }

  }



}
