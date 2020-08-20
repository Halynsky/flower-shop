import { Component, Inject, OnInit } from '@angular/core';
import { FlowerSize } from "../../api/models/FlowerSize";
import { getErrorMessage } from "../../utils/Functions";
import { FlowerSizeService } from "../../api/services/flower-size.service";
import { SnackBarService } from "../../services/snak-bar.service";
import htmlToImage from 'html-to-image';
import { DOCUMENT } from "@angular/common";
import { FlowerType } from "../../api/models/FlowerType";
import { GroupService } from "../../api/services/group.service";
import { FlowerTypeService } from "../../api/services/flower-type.service";
import { Group } from "../../api/models/Group";

@Component({
  selector: 'collages',
  templateUrl: './collages.component.html',
  styleUrls: ['./collages.component.scss']
})
export class CollagesComponent implements OnInit {

  initialized = false;
  loading = false;

  flowerTypeToAdd: FlowerType;
  flowerSizeToAdd: FlowerSize;
  groupToAdd: Group;

  flowerTypes: FlowerType[];
  allFlowerSizes: FlowerSize[];
  flowerSizes: FlowerSize[];
  groups: Group[];

  collageConfig = {
    baseWidth: 1000,
    gap: 5,
    columnsCount: 3,
    fontSize: 18
  }

  collage: FlowerSize[] = [];

  constructor(private flowerSizeService: FlowerSizeService,
              private flowerTypeService: FlowerTypeService,
              private groupService: GroupService,
              private snackBarService: SnackBarService,
              @Inject(DOCUMENT) private document: Document) {

    this.getAllFlowerSizes();
    this.getAllFlowerTypes();
  }

  ngOnInit(): void {
  }

  getAllFlowerSizes() {
    this.flowerSizeService.getAllForAdminAsList()
      .subscribe(
        flowerSizes => this.allFlowerSizes = this.flowerSizes = flowerSizes,
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  getAllFlowerTypes() {
    this.flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }

  getAllGroupsForFlowerType(flowerTypeId: number) {
    this.groupService.getByFlowerTypeId(flowerTypeId).subscribe(
      groups => this.groups = groups,
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }

  addFlowerTypeToCollage() {
    if (!this.flowerTypeToAdd) {
      return;
    }

    this.allFlowerSizes
      .filter(item => item.flower.flowerType.id == this.flowerTypeToAdd.id)
      .forEach(item => this.addItemToCollage(item))

  }

  addGroupToCollage() {
    if (!this.groupToAdd) return;

    this.allFlowerSizes
      .filter(item => item.flower.group?.id == this.groupToAdd.id)
      .forEach(item => this.addItemToCollage(item))

  }

  addItemToCollage(item = this.flowerSizeToAdd) {
    if (!item) return;

    let found = this.collage.find(el => el.id == item.id)

    if (found) {
      this.snackBarService.showWarning(`'${item.flower.nameOriginal}' вже в колажі`)
      return
    }

    this.collage.push(item)

    if (this.flowerSizeToAdd) this.flowerSizeToAdd = null
  }

  moveCollageItemUp(index) {
    if (index > 0) {
      let moved = this.collage.splice(index, 1)[0];
      this.collage.splice(index - 1, 0, moved)
    }
  }

  moveCollageItemDown(index) {
    if (index < this.collage.length) {
      let moved = this.collage.splice(index, 1)[0];
      this.collage.splice(index + 1, 0, moved)
    }
  }

  removeCollageItem(index) {
    this.collage.splice(index,1)
  }

  download() {
    if(this.collage.length == 0) {
      return
    }

    htmlToImage.toBlob(document.getElementById('collage-preview'))
      .then(function (blob) {
        window.saveAs(blob, 'collage.png');
      });
  }

  filterFlowerSizes() {
    this.flowerSizes = this.allFlowerSizes.filter(fs => {
      return (!this.flowerTypeToAdd || fs.flower.flowerType.id == this.flowerTypeToAdd.id) && (!this.groupToAdd || fs.flower.group.id == this.groupToAdd.id)
    })
  }

}
