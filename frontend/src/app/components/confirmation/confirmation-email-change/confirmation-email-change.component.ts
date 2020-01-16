import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ProfileService } from "../../../api/services/profile.service";

@Component({
  selector: 'confirmation-email-change',
  templateUrl: './confirmation-email-change.component.html',
  styleUrls: ['./confirmation-email-change.component.scss']
})
export class ConfirmationEmailChangeComponent implements OnInit {

  hasError = false;
  confirmed = false;

  constructor(private route: ActivatedRoute,
              private profileService: ProfileService) {

    this.route.queryParams.subscribe(params => {
      let secretKey = params['secretKey'];

      if(secretKey) {
        this.emailChangeConfirm(secretKey)
      } else {
        this.hasError = true;
      }

    });

  }

  ngOnInit() {
  }

  emailChangeConfirm(secretKey: string) {
    this.profileService.emailChangeConfirm(secretKey).subscribe(
      () => this.confirmed = true,
      error => this.hasError = true
    )
  }


}
