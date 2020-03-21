import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { getErrorMessage } from "../../../utils/Functions";
import { SnackBarService } from "../../../services/snak-bar.service";
import { SocialService } from "../../../api/services/social.service";
import { UserService } from "../../../api/services/user.service";

@Component({
  selector: 'add-email-dialog',
  templateUrl: './add-email-dialog.component.html',
  styleUrls: ['./add-email-dialog.component.scss']
})
export class AddEmailDialogComponent {

  user;

  registered = false;

  constructor(public dialogRef: MatDialogRef<AddEmailDialogComponent>,
              public snackBarService: SnackBarService,
              public socialService: SocialService,
              public userService: UserService) {
  }

  submit() {
    this.socialService.loginOrRegisterWithFacebook(this.user)
      .subscribe(
        user => {
          this.registered = true;
        }, error => this.snackBarService.showError(getErrorMessage(error))
      )
  }

}
