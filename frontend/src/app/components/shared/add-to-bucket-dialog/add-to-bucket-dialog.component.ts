import { Component, OnInit } from "@angular/core";
import { BucketItem } from "../../../models/Bucket";
import { FlowerService } from "../../../api/services/flower.service";
import { BucketLocalService } from "../../../services/bucket-local.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { BucketDialogComponent } from "../bucket-dialog/bucket-dialog.component";
import { FLOWER_IMAGE_PLACEHOLDER } from "../../../utils/Costants";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FlowerSize } from "../../../api/models/FlowerSize";
import { FlowerSizeService } from "../../../api/services/flower-size.service";

@Component({
  selector: 'add-to-bucket-dialog',
  templateUrl: './add-to-bucket-dialog.component.html',
  styleUrls: ['./add-to-bucket-dialog.component.scss']
})
export class AddToBucketDialogComponent implements OnInit {

  id: number;
  flowerSize: FlowerSize;
  bucketItem: BucketItem;
  flowerImagePlaceholder = FLOWER_IMAGE_PLACEHOLDER;

  constructor(public dialogRef: MatDialogRef<AddToBucketDialogComponent>,
              public dialog: MatDialog,
              private flowerService: FlowerService,
              private flowerSizeService: FlowerSizeService,
              public bucketLocalService: BucketLocalService,
              private snackBarService: SnackBarService) {
  }

  ngOnInit() {
    this.getFlowerById();
  }

  fillBucketItem(flowerSize: FlowerSize) {
    this.bucketItem = new BucketItem();
    this.bucketItem.amount = 1;
    this.bucketItem.price = flowerSize.price;
    this.bucketItem.image = flowerSize.flower.image;
    this.bucketItem.name = flowerSize.flower.nameOriginal;
    this.bucketItem.sizeName = flowerSize.size.name;
    this.bucketItem.flowerSizeId = flowerSize.id;
    this.bucketItem.flowerTypeName = flowerSize.flower.flowerType.nameSingle;
    this.bucketItem.flowerTypeId = flowerSize.flower.flowerType.id;
    this.bucketItem.flowerId = flowerSize.flower.id;
    this.bucketItem.available = flowerSize.available;
  }

  getFlowerById() {
    this.flowerSizeService.getForShop(this.id).subscribe(
      flowerSize => {
        this.flowerSize = flowerSize;
        this.fillBucketItem(this.flowerSize)
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }

  addToBucket() {
    if (this.bucketItem.amount > 0) {
      this.bucketLocalService.addToBucket([this.bucketItem]);
      this.fillBucketItem(this.flowerSize);
      this.dialogRef.close();
      this.dialog.open(BucketDialogComponent, {width: "80%", panelClass: "modal-panel-no-padding", maxWidth: 800});
    } else {
      this.snackBarService.showWarning("Вкажіть, будь ласка, кількість товару яку ви хочете придбати");
    }

  }

}
