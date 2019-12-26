import { Component } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material";
import { BucketLocalService } from "../../../../services/bucket-local.service";

@Component({
  selector: 'bottom-sheet-overview',
  templateUrl: './bottom-sheet.component.html',
})
export class BottomSheetOverview {
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetOverview>,
              private bucketLocalService: BucketLocalService) {
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
