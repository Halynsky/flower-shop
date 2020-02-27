import { Component, Input } from "@angular/core";
import { SecurityService } from "../../../services/security.service";
import { UserService } from "../../../api/services/user.service";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'user-exist-dialog',
  templateUrl: './user-exist-dialog.component.html',
  styleUrls: ['./user-exist-dialog.component.scss']
})
export class UserExistDialogComponent {

  @Input() email;

  constructor(public userService: UserService,
              public securityService: SecurityService,
              public dialogRef: MatDialogRef<UserExistDialogComponent>) {
  }


}
