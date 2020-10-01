import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage } from "../../../../utils/Functions";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";
import { FlowerTypeService } from "../../../../api/services/flower-type.service";
import { FlowerType } from "../../../../api/models/FlowerType";
import { finalize, first } from "rxjs/operators";
import { EditorDialogComponent } from "../../../shared/editor-dialog/editor-dialog.component";
import { DialogService } from "primeng/dynamicdialog";

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

  isLoaded = true;
  loading = false;

  plantingMaterialTypes = [
    {label: 'Бульба', value: 'Бульба'},
    {label: 'Бульбоцибулина', value: 'Бульбоцибулина'},
    {label: 'Коренева шишка', value: 'Коренева шишка'},
    {label: 'Корінь', value: 'Корінь'},
    {label: 'Кореневище', value: 'Кореневище'},
    {label: 'Цибулина', value: 'Цибулина'},
  ];

  dialogRef

  constructor(public dataService: FlowerTypeService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute,
              public dialogService: DialogService) {

    this.route.params.subscribe(
      params => {
        this.mode = params['mode'];

        if (this.mode == ItemSaveMode.edit) {
          this.isLoaded = false;
          this.route.queryParams.subscribe(queryParams => {
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
      .pipe(finalize(() => {
        this.loading = false;
        this.isLoaded = true;
      }))
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

  showDescriptionEditDialog() {
    this.dialogRef = this.dialogService.open(EditorDialogComponent, {
      data: {
        text: this.item.description,
        onTextSubmit: this.onTextSubmit,
      },
      header: `Edit description`,
      width: '70%'
    });
  }

  onTextSubmit = text => {
    this.dataService.updateDescription(this.item.id, text)
      .pipe(first())
      .subscribe(() => {
        this.snackBarService.showSuccess("Опис квітки оновлено");
        this.dialogRef.close();
        this.item.description = text
      }, error => this.snackBarService.showError(getErrorMessage(error)))
  }

}
