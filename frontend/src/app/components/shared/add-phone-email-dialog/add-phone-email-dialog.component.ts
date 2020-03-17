import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { SecurityService } from "../../../services/security.service";
import { finalize } from "rxjs/operators";
import { getErrorMessage } from "../../../utils/Functions";
import { SnackBarService } from "../../../services/snak-bar.service";
import { SocialService } from "../../../api/services/social.service";

@Component({
  selector: 'add-phone-email-dialog',
  templateUrl: './add-phone-email-dialog.component.html',
  styleUrls: ['./add-phone-email-dialog.component.scss']
})
export class AddPhoneEmailDialogComponent {

  user;
  userEmail: string;

  constructor(public dialogRef: MatDialogRef<AddPhoneEmailDialogComponent>,
              public snackBarService: SnackBarService,
              public socialService: SocialService,
              private securityService: SecurityService) {
  }

  submit() {
    this.user.email = this.userEmail;
    this.socialService.loginOrRegisterWithFacebook(this.user)
      .pipe(finalize(() => this.dialogRef.close()))
      .subscribe(
        user => {
          this.securityService.login(user);
        }, error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

}
