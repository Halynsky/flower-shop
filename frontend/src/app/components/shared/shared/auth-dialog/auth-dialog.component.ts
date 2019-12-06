import { Component } from "@angular/core";
import { AuthService } from "../../../../api/services/auth.service";
import { SecurityService } from "../../../../services/security.service";
import { User, UserRegistration } from "../../../../api/models/User";
import { SnackBarService } from "../../../../services/snak-bar.service";
import { MatDialogRef } from "@angular/material";
import { getErrorMessage } from "../../../../utils/Functions";
import { Credentials } from "../../../../api/models/Credentials";

@Component({
  selector: 'auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent {

  mode: 'login' | 'registration' = 'login';
  registered = false;

  credentials: Credentials = new Credentials();
  userRegistration: UserRegistration = new UserRegistration();

  constructor(private authService: AuthService,
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
    this.authService.login(this.credentials).subscribe(
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
    this.authService.register(this.userRegistration).subscribe(
      user => {
        // TODO: show message after registration
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
