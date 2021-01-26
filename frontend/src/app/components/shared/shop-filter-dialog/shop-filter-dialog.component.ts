import { Component } from "@angular/core";
import { AuthService } from "../../../api/services/auth.service";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'shop-filter-dialog',
  templateUrl: './shop-filter-dialog.component.html',
  styleUrls: ['./shop-filter-dialog.component.scss']
})
export class ShopFilterDialogComponent {

  constructor(public authService: AuthService,
              public dialogRef: MatDialogRef<ShopFilterDialogComponent>) {
  }

}
