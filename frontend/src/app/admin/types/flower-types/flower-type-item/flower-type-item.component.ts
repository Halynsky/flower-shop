import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage } from "../../../../utils/Functions";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";
import { FlowerTypeService } from "../../../../api/services/flower-type.service";
import { FlowerType } from "../../../../api/models/FlowerType";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'flower-type-item',
  templateUrl: './flower-type-item.component.html',
  styleUrls: ['./flower-type-item.component.scss']
})
export class FlowerTypeItemComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;
  previousName: string;
  private newImage: File;

  item: FlowerType = new FlowerType();

  loading = false;

  plantingMaterialTypes = [
    {label: 'Бульба', value: 'Бульба'},
    {label: 'Бульбоцибулина', value: 'Бульбоцибулина'},
    {label: 'Коренева шийка', value: 'Коренева шийка'},
    {label: 'Корінь', value: 'Корінь'},
    {label: 'Корінь з бруньками', value: 'Корінь з бруньками'},
    {label: 'Цибулина', value: 'Цибулина'},
  ];

  constructor(public dataService: FlowerTypeService,
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
    this.loading = true;
    this.dataService.getById(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      item => {
        this.item = item;
        this.previousName = item.name;
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  create() {
    this.loading = true;
    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(this.item));
    if (this.newImage) {
      formData.append('file', this.newImage);
    }
    this.dataService.create(formData)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      response => {
        this.snackBarService.showSuccess("Тип квітів успішно створено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  update() {
    this.loading = true;
    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(this.item));
    if (this.newImage) {
      formData.append('file', this.newImage);
    }
    this.dataService.update(this.item.id, formData)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      response => {
        this.snackBarService.showSuccess("Тип квітів успішно оновлено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onSubmit() {
    this.mode == ItemSaveMode.new ? this.create() : this.update()
  }

  addImage(event: File): void {
    if (!event) {
      this.item.image = null;
    }
    this.newImage = event;
  }

}
