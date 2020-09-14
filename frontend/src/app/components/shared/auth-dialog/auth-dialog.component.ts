import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../../api/services/auth.service";
import { SecurityService } from "../../../services/security.service";
import { UserRegistration } from "../../../api/models/User";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { Credentials } from "../../../api/models/Credentials";
import { UserService } from "../../../api/services/user.service";
import { finalize, first, takeUntil } from "rxjs/operators";
import { FacebookLoginProvider, SocialAuthService } from "angularx-social-login";
import { SocialService } from "../../../api/services/social.service";
import { MatDialogRef } from "@angular/material/dialog";
import { SocialUserInfo } from "../../../api/models/SocialUserInfo";
import { Subject } from "rxjs";
import { SocialUser } from "angularx-social-login/entities/social-user";

declare let FB: any;

@Component({
  selector: 'auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit, OnDestroy {

  private readonly destroyed$ = new Subject<void>();

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
      console.log("state", state)
      this.socialAuthServiceInitialized = true
      // this.socialAuthService.authState.subscribe(authState => {
      //   console.log("authState", authState)
      // })
    });

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  login() {
    this.loading = true;
    this.authService.login(this.credentials)
      .pipe(
        takeUntil(this.destroyed$),
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
        takeUntil(this.destroyed$),
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
    this.socialAuthService.authState
      .pipe(first())
      .subscribe(socialUser => {
        console.log("socialUser", socialUser)
        if (socialUser) {
          this.handleSocialUser(socialUser)
        } else {
          this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
            .then(user => this.handleSocialUser(user))
            .catch(error => {
              console.error(error)
              this.snackBarService.showError(error);
              this.loading = false;
            });
        }

      })

  }

  handleSocialUser(user: SocialUser) {
    let socialUserInfo = new SocialUserInfo();
    socialUserInfo.accessToken = user.authToken;
    this.socialService.loginWithFacebook(socialUserInfo)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        user => {
          this.securityService.login(user);
        }, error => {
          if (error.status == 401) {
            //register
            if (user.email == null) {
              this.securityService.openEmailPhoneDialog(user);
            } else {
              let socialUserInfo = new SocialUserInfo();
              socialUserInfo.accessToken = user.authToken;
              this.socialService.registerWithFacebook(socialUserInfo)
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
        takeUntil(this.destroyed$),
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
