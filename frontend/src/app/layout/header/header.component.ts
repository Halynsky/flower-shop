import { Component } from '@angular/core';
import { SecurityService } from "../../services/security.service";
import { BucketService } from "../../services/bucket.service";
import { MatDialog } from "@angular/material";
import { AuthService } from "../../api/services/auth.service";
import { SnackBarService } from "../../services/snak-bar.service";
import { Router } from "@angular/router";
import { Role } from "../../models/Role";
import { AuthDialogComponent } from "../../components/shared/shared/auth-dialog/auth-dialog.component";
import { BucketDialogComponent } from "../../components/shared/shared/bucket-dialog/bucket-dialog.component";

@Component({
  selector: 'layout-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class HeaderComponent {

  Role = Role;

  constructor(public securityService: SecurityService,
              public bucketService: BucketService,
              public dialog: MatDialog,
              private authService: AuthService,
              private snackBarService: SnackBarService,
              private router: Router) {
  }

  openAuthDialog() {
    this.dialog.open(AuthDialogComponent);
  }

  openBucketDialog() {
    this.dialog.open(BucketDialogComponent, {width: "80%", panelClass: "modal-panel-no-padding"});
  }

  logout() {
    this.authService.logot().subscribe(
      res => this.securityService.logout(),
      error => this.snackBarService.showError(error)
    )
  }

}

