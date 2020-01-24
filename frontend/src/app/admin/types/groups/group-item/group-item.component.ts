import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../../services/snak-bar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { getErrorMessage } from "../../../../utils/Functions";
import { ItemSaveMode } from "../../../../models/ItemSaveMode";
import { finalize } from "rxjs/operators";
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

  item: GroupAdmin = new GroupAdmin();
  loading = false;

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
          this.route.queryParams.subscribe(queryParams  => {
            if (queryParams['id'])
              this.getItem(queryParams['id'])
          })
        }

      }
    );

    this.getAllFlowerTypes()

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
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  getAllFlowerTypes() {
    this.flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }

  add() {
    this.dataService.add(this.item)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      response => {
        this.snackBarService.showSuccess("Групу успішно створено");
        this.location.back();
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  update() {
    this.dataService.update(this.item.id, this.item)
      .pipe(finalize(() => this.loading = false))
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
