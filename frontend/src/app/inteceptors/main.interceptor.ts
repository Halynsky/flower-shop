import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SecurityService } from "../services/security.service";

@Injectable()
export class MainInterceptor implements HttpInterceptor {
  private securityService: SecurityService;
  private router: Router;

  /**
   * Injector needs to get SecurityService
   * because angular way injection making Cyclic dependency
   */
  constructor(private injector: Injector) {
    this.securityService = this.injector.get(SecurityService);
    this.router = this.injector.get(Router);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe( tap(() => {},
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 401) {
            this.securityService.logout();
            this.router.navigate(['/']);
          }
          if (err.status == 403) {
            this.router.navigate(['/403']);
          }
        }
      }));
  }


}
