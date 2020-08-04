import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage } from "../../../../utils/Functions";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";
import { finalize, first } from "rxjs/operators";
import { GroupAdmin } from "../../../../api/models/Group";
import { GroupService } from "../../../../api/services/group.service";
import { Location } from "@angular/common";
import { FlowerTypeService } from "../../../../api/services/flower-type.service";
import { FlowerType } from "../../../../api/models/FlowerType";

@Component({
  selector: 'group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss']
})
export class GroupItemComponent implements OnInit {

  ItemSaveMode = ItemSaveMode;
  mode: ItemSaveMode = ItemSaveMode.new;

  queryParamId;

  item: GroupAdmin = new GroupAdmin();
  loading = false;
  isLoaded = false;

  flowerTypes: FlowerType[] = [];

  constructor(public dataService: GroupService,
              private flowerTypeService: FlowerTypeService,
              private snackBarService: SnackBarService,
              private router: Router,
              private route: ActivatedRoute,
              public location: Location) {
    this.route.params.subscribe(
      params => {
        this.mode = params['mode'];

        if (this.mode == ItemSaveMode.edit) {
          this.route.queryParams.subscribe(queryParams => {
            if (queryParams['id'])
              this.queryParamId = queryParams['id'];
          })
        }

      }
    );

    this.getAllFlowerTypes();
  }

  ngOnInit() {
  }

  getItem(id) {
    this.dataService.getById(id)
      .pipe(first(), finalize(() => this.isLoaded = true))
      .subscribe(
        item => {
          this.item = item;
        },
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  getAllFlowerTypes() {
    this.flowerTypeService.getAll()
      .pipe(first())
      .subscribe(
      flowerTypes => {

        this.flowerTypes = flowerTypes;

        if (this.mode === ItemSaveMode.edit) {
          this.getItem(this.queryParamId)
        } else {
          this.isLoaded = true
        }

      },
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }

  add() {
    this.loading = true;
    this.dataService.add(this.item)
      .pipe(first(), finalize(() => this.loading = false))
      .subscribe(
        response => {
          this.snackBarService.showSuccess("Групу успішно створено");
          this.location.back();
        },
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  update() {
    this.loading = true;
    this.dataService.update(this.item.id, this.item)
      .pipe(first(), finalize(() => this.loading = false))
      .subscribe(
        response => {
          this.snackBarService.showSuccess("Колір успішно оновлено");
          this.location.back();
        },
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  onSubmit() {
    this.mode == ItemSaveMode.new ? this.add() : this.update()
  }

}

