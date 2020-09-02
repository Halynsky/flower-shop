import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FlowerType } from "../../../api/models/FlowerType";
import { FlowerSize } from "../../../api/models/FlowerSize";
import { Group } from "../../../api/models/Group";
import { FlowerSizeService } from "../../../api/services/flower-size.service";
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { GroupService } from "../../../api/services/group.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { DOCUMENT } from "@angular/common";
import { getErrorMessage } from "../../../utils/Functions";

@Component({
  selector: 'items-selector',
  templateUrl: './items-selector.component.html',
  styleUrls: ['./items-selector.component.scss']
})
export class ItemsSelectorComponent implements OnInit {

  @Input() items: FlowerSize[] = [];
  @Output() itemsChange = new EventEmitter<FlowerSize[]>();

  loading = false;

  flowerTypeToAdd: FlowerType;
  flowerSizeToAdd: FlowerSize;
  groupToAdd: Group;

  flowerTypes: FlowerType[];
  allFlowerSizes: FlowerSize[];
  flowerSizes: FlowerSize[];
  groups: Group[];
  availableOnly = true;

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
    if (!flowerTypeId) return;

    this.groupService.getByFlowerTypeId(flowerTypeId).subscribe(
      groups => this.groups = groups,
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }

  addFlowerTypeToCollage() {
    if (!this.flowerTypeToAdd) return

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

    let found = this.items.find(el => el.id == item.id)

    if (found) {
      this.snackBarService.showWarning(`'${item.flower.nameOriginal}' вже в колажі`)
      return
    }

    if(this.availableOnly && item.available == 0) {
      return
    }

    this.items.push(item)

    if (this.flowerSizeToAdd) this.flowerSizeToAdd = null
  }

  filterFlowerSizes() {
    this.flowerSizes = this.allFlowerSizes.filter(fs => {
      return (!this.flowerTypeToAdd || fs.flower.flowerType.id == this.flowerTypeToAdd.id) && (!this.groupToAdd || fs.flower.group.id == this.groupToAdd.id)
    })
  }

}
