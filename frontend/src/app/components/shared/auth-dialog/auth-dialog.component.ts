import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../../api/services/auth.service";
import { SecurityService } from "../../../services/security.service";
import { UserRegistration } from "../../../api/models/User";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { Credentials } from "../../../api/models/Credentials";
import { UserService } from "../../../api/services/user.service";
import { finalize, first } from "rxjs/operators";
import { SocialService } from "../../../api/services/social.service";
import { MatDialogRef } from "@angular/material/dialog";
import { SocialUserInfo } from "../../../api/models/SocialUserInfo";
import { from } from "rxjs";
import { SocialAuthService, SocialUser } from "../../../utils/social-login/public-api";

declare let FB: any;

@Component({
  selector: 'auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit, OnDestroy {

  private readonly FACEBOOK = 'FACEBOOK';

  mode: 'login' | 'registration' | 'restore-password' = 'login';
  registered = false;
  restored = false;
  loading = false;

  credentials: Credentials = new Credentials();
  userRegistration: UserRegistration = new UserRegistration();
  passwordRestoreEmail: string;
  socialAuthServiceInitialized = false;

  constructor(public authService: AuthService,
              public userService: UserService,
              public socialService: SocialService,
              public socialAuthService: SocialAuthService,
              private securityService: SecurityService,
              private snackBarService: SnackBarService,
              public dialogRef: MatDialogRef<AuthDialogComponent>) {

    this.socialAuthService.initState.subscribe(state => {
      this.socialAuthServiceInitialized = true
    });

  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  login() {
    this.loading = true;
    this.authService.login(this.credentials)
      .pipe(
        first(),
        finalize(() => this.loading = false)
      )
      .subscribe(
        user => {
          this.securityService.login(user);
          this.dialogRef.close();
        },
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
      .pipe(
        first(),
        finalize(() => this.loading = false)
      )
      .subscribe(
        user => {
          this.registered = true;
        },
        error => {
          console.error(error)
          this.snackBarService.showError(getErrorMessage(error));
        }
      )
  }

  facebookAuth() {
    this.loading = true;
    let socialProvider = this.socialAuthService.getProvider(this.FACEBOOK)

    from(socialProvider.getProfile())
      .pipe(first())
      .subscribe((socialUser: SocialUser) => this.handleSocialUser(socialUser),
        err => {
          console.error(err)
          this.snackBarService.showError(err);
          this.loading = false;
        })

  }

  handleSocialUser(user: SocialUser) {
    let socialUserInfo = new SocialUserInfo();
    socialUserInfo.accessToken = user.authToken;
    this.socialService.loginWithFacebook(socialUserInfo)
      .pipe(
        first(),
        finalize(() => this.loading = false)
      )
      .subscribe(
        user => {
          this.securityService.login(user);
          this.dialogRef.close();
        }, error => {
          if (error.status == 401) {
            //register
            if (user.email == null) {
              this.securityService.openEmailPhoneDialog(user);
            } else {
              let socialUserInfo = new SocialUserInfo();
              socialUserInfo.accessToken = user.authToken;
              this.socialService.registerWithFacebook(socialUserInfo)
                .pipe(first())
                .subscribe(user => {
                    this.securityService.login(user)
                    this.dialogRef.close();
                  },
                  error => {
                    console.error(error)
                    this.snackBarService.showError(getErrorMessage(error))
                  }
                );
            }

          } else {
            console.error(error)
            this.snackBarService.showError(getErrorMessage(error))
          }

        }
      );
  }

  restorePassword() {
    this.loading = true;
    this.authService.passwordRestoreRequest(this.passwordRestoreEmail)
      .pipe(
        first(),
        finalize(() => this.loading = false)
      )
      .subscribe(
        () => {
          this.restored = true;
        }, error => {
          console.error(error)
          this.snackBarService.showError(getErrorMessage(error))
        }
      )
  }

}
