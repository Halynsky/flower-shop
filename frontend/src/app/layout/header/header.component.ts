import { Component } from '@angular/core';
import { SecurityService } from "../../services/security.service";
import { BucketService } from "../../services/bucket.service";
import { ModalWindowService } from "../../services/modal-window.service";
import { MatDialog } from "@angular/material";
import { DialogWindowComponent } from "../../components/shared/shared/dialog-window/dialog-window.component";
import { AuthService } from "../../api/services/auth.service";
import { SnackBarService } from "../../services/snak-bar.service";
import { User } from "../../api/models/User";
import { USER_KEY } from "../../utils/Costants";

@Component({
  selector: 'layout-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class HeaderComponent {

  constructor(public securityService: SecurityService,
              public bucketService: BucketService,
              public modalWindowService: ModalWindowService,
              public dialog: MatDialog, private authService: AuthService,
              private snackBarService: SnackBarService) {
  }

  onLoginDialog() {
    this.dialog.open(DialogWindowComponent);
  }

  logout() {
    this.authService.logot().subscribe(
      res => this.securityService.logout(),
      error => this.snackBarService.showError(error)
    )
  }


}

