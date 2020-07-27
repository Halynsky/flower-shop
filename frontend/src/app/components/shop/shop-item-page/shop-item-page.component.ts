import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FlowerService } from "../../../api/services/flower.service";
import { BucketLocalService } from "../../../services/bucket-local.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { BucketItem } from "../../../models/Bucket";
import { BucketDialogComponent } from "../../shared/bucket-dialog/bucket-dialog.component";
import { FLOWER_IMAGE_PLACEHOLDER } from "../../../utils/Costants";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FlowerSize } from "../../../api/models/FlowerSize";
import { FlowerSizeService } from "../../../api/services/flower-size.service";


@Component({
  selector: 'shop-item-page',
  templateUrl: './shop-item-page.component.html',
  styleUrls: ['./shop-item-page.component.scss']
})
export class ShopItemPageComponent implements OnInit, OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  id: number;
  flowerSize: FlowerSize;
  bucketItem: BucketItem;
  flowerImagePlaceholder = FLOWER_IMAGE_PLACEHOLDER;

  constructor(private route: ActivatedRoute,
              private flowerService: FlowerService,
              private flowerSizeService: FlowerSizeService,
              public bucketLocalService: BucketLocalService,
              private snackBarService: SnackBarService,
              public dialog: MatDialog) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getShopItem();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
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

  getShopItem() {
    this.flowerSizeService.getForShop(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
      flower => {
        this.flowerSize = flower;
        this.fillBucketItem(this.flowerSize)
      },
      error => this.snackBarService.showError(getErrorMessage(error))
    );
  }

  addToBucket() {
    if (this.bucketItem.amount > 0) {
      this.bucketLocalService.addToBucket([this.bucketItem]);
      this.fillBucketItem(this.flowerSize);

      this.dialog.open(BucketDialogComponent, {width: "80%", panelClass: "modal-panel-no-padding", maxWidth: 800});

    } else {
      this.snackBarService.showWarning("Вкажіть, будь ласка, кількість товару яку ви хочете придбати");
    }

  }

}
