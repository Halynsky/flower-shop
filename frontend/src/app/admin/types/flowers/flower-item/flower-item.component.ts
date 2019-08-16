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

@Component({
  selector: 'flower-item',
  templateUrl: './flower-item.component.html',
  styleUrls: ['./flower-item.component.scss']
})
export class FlowerItemComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;

  flowerTypes: FlowerType[] = [];
  item: FlowerFull = new FlowerFull();

  colors: Color[] = [];

  date;


  constructor(private dataService: FlowerService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute,
              private flowerTypeService: FlowerTypeService,
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
        }

      }
    )

    this.flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => this.snackBarService.showError(error.error.message)
    );

    this.colorService.getForAdmin().subscribe(
      colors => this.colors = colors,
      error => this.snackBarService.showError(error.error.message)
    );

  }

  ngOnInit() {
    this.item.isNew = false;
    this.item.isPopular = false;
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
        this.snackBarService.showSuccess("'Квітку' успішно створено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  update() {
    this.dataService.update(this.item.id, this.item).subscribe(
      response => {
        this.snackBarService.showSuccess("'Квітку' успішно оновлено");
        this.router.navigate(['../../'], {relativeTo: this.route})
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  onSubmit() {
    this.mode == ItemSaveMode.new ? this.add() : this.update()
  }

  changeDate() {
    this.item.created = this.datepipe.transform(this.date, 'yyyy-MM-dd');
  }

}
