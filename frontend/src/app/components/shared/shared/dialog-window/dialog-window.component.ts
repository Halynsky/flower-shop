import { Component } from "@angular/core";
import { AuthService } from "../../../../api/services/auth.service";
import { SecurityService } from "../../../../services/security.service";
import { User } from "../../../../api/models/User";
import { getErrorMessage } from "../../../../utils/Functions";
import { SnackBarService } from "../../../../services/snak-bar.service";

@Component({
  selector: 'dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.scss']
})
export class DialogWindowComponent {

  constructor(private authService: AuthService, private securityService: SecurityService, private snackBarService: SnackBarService,) {
  }

  userEmail;
  userPassword;
  user: User;

  onSubmit() {
    this.login();
  }

  login() {
    this.authService.login(this.userEmail, this.userPassword).subscribe(
      user => console.log(user),
      error => this.snackBarService.showError('Невірний логін або пароль')
    )
  }

}
