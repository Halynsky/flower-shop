import { Component } from "@angular/core";
import { AuthService } from "../../../../api/services/auth.service";
import { SecurityService } from "../../../../services/security.service";
import { User, UserRegistration } from "../../../../api/models/User";
import { SnackBarService } from "../../../../services/snak-bar.service";
import { MatDialogRef } from "@angular/material";
import { getErrorMessage } from "../../../../utils/Functions";
import { Credentials } from "../../../../api/models/Credentials";
import { UserService } from "../../../../api/services/user.service";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent {

  mode: 'login' | 'registration' = 'login';
  registered = false;
  loading = false;

  credentials: Credentials = new Credentials();
  userRegistration: UserRegistration = new UserRegistration();

  constructor(public authService: AuthService,
              public userService: UserService,
              private securityService: SecurityService,
              private snackBarService: SnackBarService,
              public dialogRef: MatDialogRef<AuthDialogComponent>) {
  }

  submitLogin() {
    this.login();
  }

  submitRegistration() {
    this.register();
  }

  login() {
    this.loading = true;
    this.authService.login(this.credentials)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      user => {
        this.securityService.login(user);
        this.dialogRef.close();
      } ,
      error => {
        switch (getErrorMessage(error)) {
          case 'Bad credentials': {
            this.snackBarService.showError('Невірний логін чи пароль');
            break;
          }
          case 'Account is not activated': {
            this.snackBarService.showError('Обліковий запис не активовано');
            break;
          }
          case 'User is disabled': {
            this.snackBarService.showError('Обліковий запис заблоковано');
            break;
          }
          default: {
            this.snackBarService.showError('Помилка авторизації');
            break;
          }
        }
      }
    )
  }

  register() {
    this.loading = true;
    this.authService.register(this.userRegistration)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
      user => {
        this.registered = true;
      } ,
      error => {
        this.snackBarService.showError(getErrorMessage(error));
      }
    )
  }

  // TODO: Implement this
  facebookAuth() {
  }

}
