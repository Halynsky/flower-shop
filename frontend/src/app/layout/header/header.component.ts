import { Component } from '@angular/core';
import { SecurityService } from "../../services/security.service";
import { BucketLocalService } from "../../services/bucket-local.service";
import { AuthService } from "../../api/services/auth.service";
import { SnackBarService } from "../../services/snak-bar.service";
import { Router } from "@angular/router";
import { Role } from "../../models/Role";
import { getErrorMessage } from "../../utils/Functions";
import { GlobalSearchService } from "../../services/global-search.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'layout-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class HeaderComponent {

  Role = Role;
  globalSearch;

  constructor(public securityService: SecurityService,
              public bucketLocalService: BucketLocalService,
              public dialog: MatDialog,
              private authService: AuthService,
              private snackBarService: SnackBarService,
              public globalSearchService: GlobalSearchService,
              private router: Router) {
  }

  logout() {
    this.authService.logout().subscribe(
      res => this.securityService.logout(),
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

}

