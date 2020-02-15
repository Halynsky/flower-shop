import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ProfileService } from "../../../api/services/profile.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: 'confirmation-email-change',
  templateUrl: './confirmation-email-change.component.html',
  styleUrls: ['./confirmation-email-change.component.scss']
})
export class ConfirmationEmailChangeComponent implements OnInit, OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  hasError = false;
  confirmed = false;

  constructor(private route: ActivatedRoute,
              private profileService: ProfileService) {

    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
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

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  emailChangeConfirm(secretKey: string) {
    this.profileService.emailChangeConfirm(secretKey)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
      () => this.confirmed = true,
      error => this.hasError = true
    )
  }

}
