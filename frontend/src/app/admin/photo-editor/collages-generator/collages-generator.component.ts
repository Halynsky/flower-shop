import { Component, Inject, OnInit } from '@angular/core';
import { FlowerSize } from "../../../api/models/FlowerSize";
import { FlowerSizeService } from "../../../api/services/flower-size.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { DOCUMENT } from "@angular/common";
import { GroupService } from "../../../api/services/group.service";
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { toBlob } from "html-to-image";

@Component({
  selector: 'collages-generator',
  templateUrl: './collages-generator.component.html',
  styleUrls: ['./collages-generator.component.scss']
})
export class CollagesGeneratorComponent implements OnInit {

  loading = false;

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

  }

  ngOnInit(): void {
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

    toBlob(document.getElementById('collage-preview'))
      .then(function (blob) {
        window.saveAs(blob, 'collage.png');
      });
  }

}
