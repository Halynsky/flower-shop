import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../../../api/services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { PasswordRestoreConfirm } from "../../../api/models/PasswordRestoreConfirm";
import { SecurityService } from "../../../services/security.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: 'confirmation-password-restore',
  templateUrl: './confirmation-password-restore.component.html',
  styleUrls: ['./confirmation-password-restore.component.scss']
})
export class ConfirmationPasswordRestoreComponent implements OnInit, OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  hasError = false;
  confirmed = false;
  passwordRestoreConfirm: PasswordRestoreConfirm = new PasswordRestoreConfirm();
  loading = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private securityService: SecurityService) {

    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
      this.passwordRestoreConfirm.secretKey = params['secretKey'];

    });

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  restorePassword() {
    this.authService.passwordRestoreConfirm(this.passwordRestoreConfirm)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
      user => {
        this.confirmed = true;
        this.securityService.login(user);
      },
      error => this.hasError = true
    )
  }

}
