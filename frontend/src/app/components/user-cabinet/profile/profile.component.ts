import {Component} from "@angular/core";
import { SecurityService } from "../../../services/security.service";
import { PasswordUpdate, Profile } from "../../../api/models/Profile";
import { ProfileService } from "../../../api/services/profile.service";
import { UserService } from "../../../api/services/user.service";
import { finalize } from "rxjs/operators";
import { SnackBarService } from "../../../services/snak-bar.service";
import { getErrorMessage } from "../../../utils/Functions";
import { SocialService } from "../../../api/services/social.service";
import { AuthService as SocialAuthService, FacebookLoginProvider } from 'angularx-social-login'

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {

  profile: Profile;
  passwordUpdate: PasswordUpdate = new PasswordUpdate();
  socialConnections: any[];
  loadingProfile = false;
  loadingPassword = false;
  loadingConnectFacebook = false;
  previousEmail;

  constructor(public securityService: SecurityService,
              public userService: UserService,
              public profileService: ProfileService,
              public snackBarService: SnackBarService,
              public socialService: SocialService,
              public socialAuthService: SocialAuthService){
    this.getProfile();
    this.getSocialConnections()
  }

  getProfile() {
    this.loadingProfile = true;
    this.profileService.get()
      .pipe(finalize(() => this.loadingProfile = false))
      .subscribe(profile => {
        this.profile = profile;
        this.previousEmail = this.profile.email
      },
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  updateProfile() {
    this.loadingProfile = true;
    this.profileService.update(this.profile)
      .pipe(finalize(() => this.loadingProfile = false))
      .subscribe(() => {
          this.snackBarService.showSuccess("Ваш профіль успішно оновлено")
      },
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  updatePassword() {
    this.loadingPassword = true;
    this.profileService.updatePassword(this.passwordUpdate)
      .pipe(finalize(() => this.loadingPassword = false))
      .subscribe(() => {
          this.snackBarService.showSuccess("Пароль до вашого аккаунту успішно оновлено")
        },
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  getSocialConnections() {
    this.socialService.getConnections().pipe(finalize(() => this.loadingPassword = false))
      .subscribe(socialConnections => this.socialConnections = socialConnections,
        error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  connectFacebook() {
    this.loadingConnectFacebook = true;
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then(user => {
        this.socialService.connectFacebook(user.authToken)
          .pipe(finalize(() => this.loadingConnectFacebook = false))
          .subscribe(
            () => {
              this.socialConnections.push({provider: "FACEBOOK"});
              this.snackBarService.showSuccess("Facebook аккаунт успішно приєднано до вашого профілю")
            }, error => this.snackBarService.showError(getErrorMessage(error))
          )
      })
      .catch(error => {
        this.snackBarService.showError(getErrorMessage(error));
        this.loadingConnectFacebook = false;
      });
  }

  disconnectFacebook() {
    this.socialService.disconnectFacebook()
      .pipe(finalize(() => this.loadingConnectFacebook = false))
      .subscribe(
        () => {
          this.socialConnections.splice(this.socialConnections.findIndex(element => element.provider == "FACEBOOK"), 1);
          this.snackBarService.showSuccess("Facebook аккаунт успішно відєднано від вашого профілю")
        }, error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

  hasSocialConnection(socialProvider: string) {
    if (!this.socialConnections || this.socialConnections.length <= 0) {
      return false
    } else {
      return this.socialConnections.some(element => element.provider == socialProvider)
    }
  }

}