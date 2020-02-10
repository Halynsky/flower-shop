import { SecurityService } from "../../services/security.service";
import { AuthDialogComponent } from "../shared/auth-dialog/auth-dialog.component";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent implements OnInit {

  constructor(public securityService: SecurityService,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  openAuthDialog() {
    this.dialog.open(AuthDialogComponent);
  }

}
