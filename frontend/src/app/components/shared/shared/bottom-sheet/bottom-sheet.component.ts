import { Component } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material";
import { BucketService } from "../../../../services/bucket.service";

@Component({
  selector: 'bottom-sheet-overview',
  templateUrl: './bottom-sheet.component.html',
})
export class BottomSheetOverview {
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetOverview>, private bucketService: BucketService) {
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
