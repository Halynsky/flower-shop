import { Component, OnInit } from "@angular/core";
import { SnackBarService } from "../../../services/snak-bar.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'message-options-dialog',
  templateUrl: './message-options-dialog.component.html',
  styleUrls: ['./message-options-dialog.component.scss']
})
export class MessageOptionsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MessageOptionsDialogComponent>,
              public dialog: MatDialog,
              private snackBarService: SnackBarService) {
  }

  ngOnInit() {
  }

}
