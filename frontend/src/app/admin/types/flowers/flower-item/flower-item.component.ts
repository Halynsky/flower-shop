import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage } from "../../../../utils/Functions";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";
import { FlowerTypeService } from "../../../../api/services/flower-type.service";
import { Flower } from "../../../../api/models/Flower";
import { FlowerService } from "../../../../api/services/flower.service";
import { LabelValueTuple } from "../../../../models/LabelValueTuple";
import {SelectItem} from 'primeng/api';
import { FlowerType } from "../../../../api/models/FlowerType";
import { error } from "@angular/compiler/src/util";

@Component({
  selector: 'flower-item',
  templateUrl: './flower-item.component.html',
  styleUrls: ['./flower-item.component.scss']
})
export class FlowerItemComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;



  flowerTypes: FlowerType[] = [];


  item: Flower = new Flower();

  constructor(private dataService: FlowerService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute,
              private flowerTypeService: FlowerTypeService) {
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

    this.flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => this.snackBarService.showError(error.error.message)
    );



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



}
