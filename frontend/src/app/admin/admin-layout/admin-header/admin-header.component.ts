import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from "primeng/api";
import { SecurityService } from "../../../services/security.service";
import { getErrorMessage } from "../../../utils/Functions";
import { AuthService } from "../../../api/services/auth.service";
import { SnackBarService } from "../../../services/snak-bar.service";

@Component({
  selector: 'admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  sidebar: boolean = true;
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();
  userActions: Array<MenuItem> = [
    {icon: 'fas fa-sign-out-alt', label: 'Вихід', command: () => this.logout()}
  ];

  constructor(public securityService: SecurityService,
              public authService: AuthService,
              public snackBarService: SnackBarService) {
  }

  logout(): void {
    this.authService.logout().subscribe(
      res => this.securityService.logout(),
      error => this.snackBarService.showError(getErrorMessage(error))
    )
  }

  ngOnInit(): void {
  }

}
