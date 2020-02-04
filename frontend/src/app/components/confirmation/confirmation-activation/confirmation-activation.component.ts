import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../api/services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { SecurityService } from "../../../services/security.service";

@Component({
  selector: 'confirmation-activation',
  templateUrl: './confirmation-activation.component.html',
  styleUrls: ['./confirmation-activation.component.scss']
})
export class ConfirmationActivationComponent implements OnInit {

  hasError = false;
  confirmed = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private securityService: SecurityService) {

    this.route.queryParams.subscribe(params => {
      let secretKey = params['secretKey'];

      if(secretKey) {
        this.activate(secretKey)
      } else {
        this.hasError = true;
      }

    });

  }

  ngOnInit() {
  }

  activate(secretKey: string) {
    this.authService.activate(secretKey).subscribe(
      user => {
        this.confirmed = true;
        this.securityService.login(user);
      },
      error => this.hasError = true
    )
  }


  // TODO: Implement activation

}
