import { Component, Inject, OnInit } from '@angular/core';
import { FlowerSize } from "../../../api/models/FlowerSize";
import { FlowerSizeService } from "../../../api/services/flower-size.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { DOCUMENT } from "@angular/common";
import { GroupService } from "../../../api/services/group.service";
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { toBlob } from "html-to-image";

@Component({
  selector: 'photo-generator',
  templateUrl: './photo-generator.component.html',
  styleUrls: ['./photo-generator.component.scss']
})
export class PhotoGeneratorComponent implements OnInit {

  ALL_SPACES_PATTERN = new RegExp(/ /g);
  ALL_APOSTROPHE_PATTERN = new RegExp(/'/g);
  ALL_SLASH_PATTERN = new RegExp(/\//g);

  loading = false;

  photoConfig = {
    baseWidth: 500,
    fontSize: 26
  }

  items: FlowerSize[] = [];

  constructor(private flowerSizeService: FlowerSizeService,
              private flowerTypeService: FlowerTypeService,
              private groupService: GroupService,
              private snackBarService: SnackBarService,
              @Inject(DOCUMENT) private document: Document) {

  }

  ngOnInit(): void {
  }

  removeSelectedItem(index) {
    this.items.splice(index,1)
  }

  download() {
    if(this.items.length == 0) {
      return
    }

    this.items.forEach((item, index) => {
      let id = (item.flower.nameOriginal + '_' + item.size.name)
        .replace(this.ALL_SPACES_PATTERN, "_")
        .replace(this.ALL_APOSTROPHE_PATTERN, "")
        .replace(this.ALL_SLASH_PATTERN, "-")
        console.log(id, item)

      toBlob(document.getElementById(id))
        .then(function (blob) {
          setTimeout(() => {
            window.saveAs(blob, `${id}.png`);
          }, index * 500)
        });
    })
  }

}
