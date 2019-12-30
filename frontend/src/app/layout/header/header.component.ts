import { Component } from '@angular/core';
import { SecurityService } from "../../services/security.service";
import { BucketLocalService } from "../../services/bucket-local.service";
import { MatDialog } from "@angular/material";
import { AuthService } from "../../api/services/auth.service";
import { SnackBarService } from "../../services/snak-bar.service";
import { Router } from "@angular/router";
import { Role } from "../../models/Role";
import { AuthDialogComponent } from "../../components/shared/auth-dialog/auth-dialog.component";
import { BucketDialogComponent } from "../../components/shared/bucket-dialog/bucket-dialog.component";

@Component({
  selector: 'layout-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class HeaderComponent {

  Role = Role;

  constructor(public securityService: SecurityService,
              public bucketLocalService: BucketLocalService,
              public dialog: MatDialog,
              private authService: AuthService,
              private snackBarService: SnackBarService,
              private router: Router) {
  }

  openAuthDialog() {
    this.dialog.open(AuthDialogComponent);
  }

  openBucketDialog() {
    this.dialog.open(BucketDialogComponent, {width: "80%", panelClass: "modal-panel-no-padding", maxWidth: 800});
  }

  logout() {
    this.authService.logot().subscribe(
      res => this.securityService.logout(),
      error => this.snackBarService.showError(error)
    )
  }

}

