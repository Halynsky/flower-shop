import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../api/services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { PasswordRestoreConfirm } from "../../../api/models/PasswordRestoreConfirm";

@Component({
  selector: 'confirmation-password-restore',
  templateUrl: './confirmation-password-restore.component.html',
  styleUrls: ['./confirmation-password-restore.component.scss']
})
export class ConfirmationPasswordRestoreComponent implements OnInit {

  hasError = false;
  confirmed = false;
  passwordRestoreConfirm: PasswordRestoreConfirm = new PasswordRestoreConfirm();
  loading = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService) {

    this.route.queryParams.subscribe(params => {
      this.passwordRestoreConfirm.secretKey = params['secretKey'];

    });

  }

  ngOnInit() {
  }

  restorePassword() {
    this.authService.passwordRestoreConfirm(this.passwordRestoreConfirm).subscribe(
      () => this.confirmed = true,
      error => this.hasError = true
    )
  }

}
