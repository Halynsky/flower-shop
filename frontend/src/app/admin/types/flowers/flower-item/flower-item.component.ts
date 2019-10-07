import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage } from "../../../../utils/Functions";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";
import { FlowerTypeService } from "../../../../api/services/flower-type.service";
import { FlowerFull } from "../../../../api/models/Flower";
import { FlowerService } from "../../../../api/services/flower.service";
import { FlowerType } from "../../../../api/models/FlowerType";
import { ColorService } from "../../../../api/services/color.service";
import { Color } from "../../../../api/models/Color";
import { TranslationService } from "../../../../utils/translation.service";
import { DatePipe } from "@angular/common";
import { SizeService } from "../../../../api/services/size.service";
import { Size } from "../../../../api/models/Size";
import { FlowerSize } from "../../../../api/models/FlowerSize";

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

  flowerTypes: FlowerType[] = [];
  item: FlowerFull = new FlowerFull();

  colors: Color[] = [];

  sizes: Size[] = [];
  sizesToChange: Size[] = [];

  isInitialised: boolean = false;
  isEqual: boolean = false;

  flowerSizes: FlowerSize[] = [];

  isEditFlowerSizesShowed: boolean = false;

  date;


  constructor(private dataService: FlowerService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute,
              private flowerTypeService: FlowerTypeService,
              private sizeService: SizeService,
              private colorService: ColorService,
              private translation: TranslationService,
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
        } else {
          this.isEditFlowerSizesShowed = true;
        }

      }
    );

    this.flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => this.snackBarService.showError(error.error.message)
    );

    this.colorService.getForAdmin().subscribe(
      colors => this.colors = colors,
      error => this.snackBarService.showError(error.error.message)
    );

    this.sizeService.getAll().subscribe(
      sizes => this.sizes = sizes,
      error => this.snackBarService.showError(error.error.message)
    );

  }

  initializeFlowerSizes() {
      if (!this.isInitialised) {
        this.flowerSizes = [];
        for (let i = 0; i < this.sizes.length; i++) {
          this.flowerSizes[i] = new FlowerSize();
        }
        this.isInitialised = true;
      }
      if (this.isEqual) {
        this.flowerSizes.push(new FlowerSize());
      }

  }

  ngOnInit() {
  }


  getItem(id) {
    this.dataService.getById(id).subscribe(
      item => {
        this.item = item;
        this.previousNameOriginal = item.nameOriginal;
        this.previousName = item.name;
      } ,
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  compareArrays(sizes, flowerSizes) {
    if (sizes.length < flowerSizes.length) {
      let fs: FlowerSize[] = [];
      for (let i = 0; i < sizes.length; i++) {
        fs[i] = new FlowerSize();
        fs[i].size = sizes[i];
      }
      this.flowerSizes = fs;
      this.isEqual = true;
    } else if (flowerSizes.length <= this.sizes) {
      this.isEqual = false;
    }
  }


  create() {
    this.compareArrays(this.sizesToChange, this.flowerSizes);
    this.item.flowerSizes = this.flowerSizes;
    this.dataService.create(this.item).subscribe(
      response => {
        this.snackBarService.showSuccess("'Квітку' успішно створено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  update() {
    if (this.isEditFlowerSizesShowed) {
      this.compareArrays(this.sizesToChange, this.flowerSizes);
      this.item.flowerSizes = this.flowerSizes;
    }
    this.dataService.update(this.item.id, this.item).subscribe(
      response => {
        this.snackBarService.showSuccess("'Квітку' успішно оновлено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onSubmit() {
    this.mode == ItemSaveMode.new ? this.create() : this.update()
  }

  changeDate() {
    this.item.created = this.datepipe.transform(this.date, 'yyyy-MM-dd');
  }

  onSizeChange(size, i) {
    this.flowerSizes[i].size = size;
  }

}
