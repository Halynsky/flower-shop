import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FlowerService } from "../../../api/services/flower.service";
import { FlowerFull } from "../../../api/models/Flower";
import { BucketLocalService } from "../../../services/bucket-local.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { BucketItem } from "../../../models/Bucket";
import { BucketDialogComponent } from "../../shared/bucket-dialog/bucket-dialog.component";
import { FLOWER_IMAGE_PLACEHOLDER } from "../../../utils/Costants";
import { MatDialog } from "@angular/material/dialog";


@Component({
  selector: 'shop-item-page',
  templateUrl: './shop-item-page.component.html',
  styleUrls: ['./shop-item-page.component.scss']
})
export class ShopItemPageComponent implements OnInit {

  id: number;
  flower: FlowerFull;
  bucketItems: BucketItem[] = [];
  flowerImagePlaceholder = FLOWER_IMAGE_PLACEHOLDER;

  constructor(private route: ActivatedRoute,
              private flowerService: FlowerService,
              public bucketLocalService: BucketLocalService,
              private snackBarService: SnackBarService,
              public dialog: MatDialog) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getFlowerById();
    });
  }

  ngOnInit() {
  }


  fillBucketItems(flower: FlowerFull) {
    for (let flowerSize of flower.flowerSizes) {
      let bucketItem = new BucketItem();
      bucketItem.amount = 0;
      bucketItem.price = flowerSize.price;
      bucketItem.image = flower.image;
      bucketItem.name = flower.nameOriginal;
      bucketItem.sizeName = flowerSize.size.name;
      bucketItem.flowerSizeId = flowerSize.id;
      bucketItem.flowerTypeName = flower.flowerType.nameSingle;
      bucketItem.flowerTypeId = flower.flowerType.id;
      bucketItem.flowerId = flower.id;
      bucketItem.available = flowerSize.available;
      this.bucketItems.push(bucketItem);
    }
  }

  getFlowerById() {
    this.flowerService.getFlowerFullById(this.id).subscribe(
      flower => {
        this.flower = flower;
        this.fillBucketItems(this.flower)
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }

  addToBucket() {
    if (this.countSelectedAmount() > 0) {
      this.bucketLocalService.addToBucket(this.bucketItems.filter(item => item.amount > 0));
      this.bucketItems = [];
      this.fillBucketItems(this.flower);

      this.dialog.open(BucketDialogComponent, {width: "80%", panelClass: "modal-panel-no-padding", maxWidth: 800});

    } else {
      this.snackBarService.showWarning("Вкажіть, будь ласка, кількість товару яку ви хочете придбати");
    }

  }

  countSelectedAmount() {
    return this.bucketItems.reduce(((accumulator, item) => accumulator + item.amount), 0)
  }

  hasAvailableFlowerSize(flower: FlowerFull) {
    return flower.flowerSizes.some(item => item.available > 0)
  }

  getTotalPrice() {
    return this.bucketItems.map(item => item.amount * item.price).reduce((accumulator, currentValue) => accumulator + currentValue)
  }

}
