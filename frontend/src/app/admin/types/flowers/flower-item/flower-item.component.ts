import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { clone, getErrorMessage } from "../../../../utils/Functions";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";
import { FlowerTypeService } from "../../../../api/services/flower-type.service";
import { FlowerFull } from "../../../../api/models/Flower";
import { FlowerService } from "../../../../api/services/flower.service";
import { FlowerType } from "../../../../api/models/FlowerType";
import { ColorService } from "../../../../api/services/color.service";
import { Color } from "../../../../api/models/Color";
import { DatePipe } from "@angular/common";
import { SizeService } from "../../../../api/services/size.service";
import { Size } from "../../../../api/models/Size";
import { FlowerSize } from "../../../../api/models/FlowerSize";
import { TranslationService } from "../../../../utils/translation.service";

@Component({
  selector: 'flower-item',
  templateUrl: './flower-item.component.html',
  styleUrls: ['./flower-item.component.scss']
})
export class FlowerItemComponent implements OnInit {

  previousNameOriginal;
  previousName;
  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;
  private newImage: File;

  flowerTypes: FlowerType[] = [];
  item: FlowerFull = new FlowerFull();

  colors: Color[] = [];
  sizes: Size [] = [];

  sizeToAdd: Size;

  constructor(public dataService: FlowerService,
              public translation: TranslationService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute,
              private flowerTypeService: FlowerTypeService,
              private sizeService: SizeService,
              private colorService: ColorService,
              public datepipe: DatePipe) {
    this.route.params.subscribe(
      params => {
        this.mode = params['mode'];

        if (this.mode == ItemSaveMode.edit) {
          this.route.queryParams.subscribe(queryParams => {
            if (queryParams['id']) {
              this.getItem(queryParams['id']);
            }
          })
        }

      }
    );

    this.flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => this.snackBarService.showError(getErrorMessage(error))
    );

    this.colorService.getForAdmin().subscribe(
      colors => this.colors = colors,
      error => this.snackBarService.showError(getErrorMessage(error))
    );

    this.sizeService.getAll().subscribe(
      sizes => this.sizes = sizes,
      error => this.snackBarService.showError(getErrorMessage(error))
    );

  }

  ngOnInit() {
  }


  getItem(id) {
    this.dataService.getById(id).subscribe(
      item => {
        item.flowerSizes.forEach(fs => fs.price = fs.price / 100);
        this.item = item;
        this.previousNameOriginal = item.nameOriginal;
        this.previousName = item.name;
      } ,
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  create() {
    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(this.item));
    if (this.newImage) {
      formData.append('file', this.newImage);
    }
    this.dataService.create(formData).subscribe(
      response => {
        this.snackBarService.showSuccess("'Квітку' успішно створено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  update() {
    const formData: FormData = new FormData();
    let item = clone(this.item);
    item.flowerSizes.forEach(fs => fs.price = fs.price * 100);
    formData.append('data', JSON.stringify(item));
    if (this.newImage) {
      formData.append('file', this.newImage);
    }
    this.dataService.update(this.item.id, formData).subscribe(
      response => {
        this.snackBarService.showSuccess("'Квітку' успішно оновлено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => {
        this.snackBarService.showError(getErrorMessage(error));
        this.getItem(item.id);
      }
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

  removeFlowerSize(i) {
    this.item.flowerSizes.splice(i, 1);
  }

  addFlowerSize() {
    console.log(this.sizeToAdd);

    if (!this.sizeToAdd) {
      this.snackBarService.showWarning('Оберіть розмір квітки який ви хочете додати');
      return;
    }

    let found = this.item.flowerSizes.find(item => item.size.id == this.sizeToAdd.id);

    if (found) {
      this.snackBarService.showWarning('Обраний Розмір вже додано');
      return;
    }

    let flowerSize = new FlowerSize();
    flowerSize.size = this.sizeToAdd;

    this.item.flowerSizes.push(flowerSize);

  }

}
