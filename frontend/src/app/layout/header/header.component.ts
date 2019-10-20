import { Component } from '@angular/core';
import { SecurityService } from "../../services/security.service";
import { BucketService } from "../../services/bucket.service";
import { ModalWindowService } from "../../services/modal-window.service";
import { MatDialog } from "@angular/material";
import { DialogWindowComponent } from "../../components/shared/shared/dialog-window/dialog-window.component";

@Component({
  selector: 'layout-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class HeaderComponent {

  constructor(public securityService: SecurityService, public bucketService: BucketService, public modalWindowService: ModalWindowService, public dialog: MatDialog) {

  }

  onLoginDialog() {
    let dialogRef = this.dialog.open(DialogWindowComponent);
  }


}

