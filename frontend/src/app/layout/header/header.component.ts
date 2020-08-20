import { Component } from '@angular/core';
import { SecurityService } from "../../services/security.service";
import { BucketLocalService } from "../../services/bucket-local.service";
import { AuthService } from "../../api/services/auth.service";
import { SnackBarService } from "../../services/snak-bar.service";
import { Role } from "../../models/Role";
import { getErrorMessage } from "../../utils/Functions";
import { GlobalSearchService } from "../../services/global-search.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ContactUsService } from "../../services/contact-us.service";
import { ShopFilterDialogComponent } from "../../components/shared/shop-filter-dialog/shop-filter-dialog.component";
import { CatalogDialogComponent } from "../../components/catalog/catalog-dialog/catalog-dialog.component";

@Component({
  selector: 'layout-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class HeaderComponent {

  Role = Role;
  globalSearch;

  catalogDialogRef: MatDialogRef<any>;

  constructor(public securityService: SecurityService,
              public bucketLocalService: BucketLocalService,
              public dialog: MatDialog,
              private authService: AuthService,
              private snackBarService: SnackBarService,
              public globalSearchService: GlobalSearchService,
              public contactUsService: ContactUsService) {
    this.bucketLocalService.updateBucketFlowerSizes();
  }

  logout() {
    this.authService.logout().subscribe(
      res => this.securityService.logout(),
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  openCatalogModal() {
    this.catalogDialogRef = this.dialog.open(CatalogDialogComponent, {
      height: '100vh',
      width: '100vw',
    });
  }

}

