import { Component, OnInit } from "@angular/core";
import { SnackBarService } from "../../../services/snak-bar.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'how-to-pay-dialog',
  templateUrl: './how-to-pay-dialog.component.html',
  styleUrls: ['./how-to-pay-dialog.component.scss']
})
export class HowToPayDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<HowToPayDialogComponent>,
              public dialog: MatDialog,
              private snackBarService: SnackBarService) {
  }

  ngOnInit() {
  }

}
