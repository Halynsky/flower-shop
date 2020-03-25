import { Component } from "@angular/core";
import { AuthService } from "../../../api/services/auth.service";
import { SecurityService } from "../../../services/security.service";
import { UserRegistration } from "../../../api/models/User";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { Credentials } from "../../../api/models/Credentials";
import { UserService } from "../../../api/services/user.service";
import { finalize } from "rxjs/operators";
import { AuthService as SocialAuthService, FacebookLoginProvider } from "angularx-social-login";
import { SocialService } from "../../../api/services/social.service";
import { MatDialogRef } from "@angular/material/dialog";
import { SocialUserInfo } from "../../../api/models/SocialUserInfo";

@Component({
  selector: 'auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent {

  mode: 'login' | 'registration' | 'restore-password' = 'login';
  registered = false;
  restored = false;
  loading = false;

  credentials: Credentials = new Credentials();
  userRegistration: UserRegistration = new UserRegistration();
  passwordRestoreEmail: string;

  constructor(public authService: AuthService,
              public userService: UserService,
              public socialService: SocialService,
              public socialAuthService: SocialAuthService,
              private securityService: SecurityService,
              private snackBarService: SnackBarService,
              public dialogRef: MatDialogRef<AuthDialogComponent>) {
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
            this.snackBarService.showError(getErrorMessage(error));
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

  facebookAuth() {
    this.loading = true;
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then(user => {
        this.socialService.existsByProviderId(user.id)
          .subscribe(
            email => {
              if (user.email == null && !email) {
                this.securityService.openEmailPhoneDialog(user)
              } else {
                let socialUserInfo = new SocialUserInfo()
                socialUserInfo.accessToken = user.authToken;
                socialUserInfo.email = email;
                socialUserInfo.isLogin = true;
                this.socialService.loginOrRegisterWithFacebook(socialUserInfo)
                  .pipe(finalize(() => this.loading = false))
                  .subscribe(
                    user => {
                      this.securityService.login(user);
                    }, error => this.snackBarService.showError(getErrorMessage(error))
                  )
              }
              this.dialogRef.close();
            }
          );
      })
      .catch(error => {
        this.snackBarService.showError(error);
        this.loading = false;
      });
  }

  restorePassword() {
    this.loading = true;
    this.authService.passwordRestoreRequest(this.passwordRestoreEmail)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.restored = true;
        }, error => this.snackBarService.showError(getErrorMessage(error))
      )
  }


}
