import { Component, Inject, OnInit } from '@angular/core';
import { FlowerSize } from "../../api/models/FlowerSize";
import { finalize } from "rxjs/operators";
import { getErrorMessage } from "../../utils/Functions";
import { FlowerSizeService } from "../../api/services/flower-size.service";
import { SnackBarService } from "../../services/snak-bar.service";
import htmlToImage from 'html-to-image';
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'collages',
  templateUrl: './collages.component.html',
  styleUrls: ['./collages.component.scss']
})
export class CollagesComponent implements OnInit {

  initialized = false;
  loading = false;
  flowerSizeToAdd: FlowerSize;
  flowerSizes: FlowerSize[];

  collageSize = {
    baseWidth: 1000,
    gap: 5
  }

  collage: FlowerSize[] = [];

  constructor(private flowerSizeService: FlowerSizeService,
              private snackBarService: SnackBarService,
              @Inject(DOCUMENT) private document: Document) {

    this.getAllFlowerSizes();
  }

  ngOnInit(): void {
  }

  getAllFlowerSizes() {
    this.flowerSizeService.getAllForAdminAsList()
      .pipe(finalize(() => this.initialized = true))
      .subscribe(
        flowerSizes => this.flowerSizes = flowerSizes,
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  addOrderItem() {
    if (!this.flowerSizeToAdd) {
      return;
    }

    let found = this.collage.find(item => item.id == this.flowerSizeToAdd.id)

    if (found) {
      this.snackBarService.showWarning(`'${this.flowerSizeToAdd.flower.nameOriginal}' вже в колажі`)
      return
    }

    this.collage.push(this.flowerSizeToAdd)

    console.log(this.collage)

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

}
