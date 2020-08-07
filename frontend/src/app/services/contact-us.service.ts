import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MessageOptionsDialogComponent } from "../components/shared/message-options-dialog/message-options-dialog.component";


@Injectable({providedIn: 'root'})
export class ContactUsService {

  messageOptionsDialogRef: MatDialogRef<any>;

  constructor(public dialog: MatDialog) {
  }

  openMessageOptionsDialog() {
    this.messageOptionsDialogRef = this.dialog.open(MessageOptionsDialogComponent);
  }

}
