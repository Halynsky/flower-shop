import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";
import { SnackBarService } from "../../../services/snak-bar.service";

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
