import { Component } from "@angular/core";
import { AuthService } from "../../../../api/services/auth.service";
import { SecurityService } from "../../../../services/security.service";
import { User } from "../../../../api/models/User";
import { SnackBarService } from "../../../../services/snak-bar.service";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.scss']
})
export class DialogWindowComponent {

  constructor(private authService: AuthService, private securityService: SecurityService, private snackBarService: SnackBarService, public dialogRef: MatDialogRef<DialogWindowComponent>) {
  }

  userEmail;
  userPassword;
  user: User;

  onSubmit() {
    this.login();

  }

  login() {
    this.authService.login(this.userEmail, this.userPassword).subscribe(
      user => {
        this.securityService.login(user);
        this.dialogRef.close();
      } ,
      error => this.snackBarService.showError('Невірний логін або пароль')
    )
  }

}
