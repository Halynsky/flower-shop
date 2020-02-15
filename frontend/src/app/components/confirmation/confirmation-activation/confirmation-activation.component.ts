import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../../../api/services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { SecurityService } from "../../../services/security.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'confirmation-activation',
  templateUrl: './confirmation-activation.component.html',
  styleUrls: ['./confirmation-activation.component.scss']
})
export class ConfirmationActivationComponent implements OnInit, OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  hasError = false;
  confirmed = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private securityService: SecurityService) {

    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
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

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  activate(secretKey: string) {
    this.authService.activate(secretKey)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
      user => {
        this.confirmed = true;
        this.securityService.login(user);
      },
      error => this.hasError = true
    )
  }

}
