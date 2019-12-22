import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AuthService } from "../../../../api/services/auth.service";
import { MatDialogRef } from "@angular/material";
import { ShopFilter } from "../../../../api/models/ShopFilter";

@Component({
  selector: 'shop-filter-dialog',
  templateUrl: './shop-filter-dialog.component.html',
  styleUrls: ['./shop-filter-dialog.component.scss']
})
export class ShopFilterDialogComponent {

  @Input()
  filters = new ShopFilter();
  @Output()
  onFilterChange: EventEmitter<any> = new EventEmitter();


  constructor(public authService: AuthService,
              public dialogRef: MatDialogRef<ShopFilterDialogComponent>) {
  }

  filterChange(event: any) {
    this.onFilterChange.emit(event)
  }

}
