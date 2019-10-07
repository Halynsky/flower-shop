import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from "rxjs";
import { catchError, debounceTime, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Directive({
  selector: '[uniqueValidator][formControlName], [uniqueValidator][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => UniqueValidator),
      multi: true
    }
  ]
})

export class UniqueValidator implements AsyncValidator {
  private timeoutDelay: number = 500;

  @Input() previousValue;
  @Input('uniqueValidator') validationFn: (value: string) => Observable<any>;
  @Input('uniqueError') errorKey: string = 'unique';
  @Input('uniqueReverse') reverse: boolean = false;

  constructor(private http: HttpClient) {}

   validate(control: AbstractControl): Observable<ValidationErrors|null>  {
    if (control.value) {
      if(this.previousValue) {
        if((control.value as String).toLowerCase().trim() === this.previousValue.toLowerCase().trim()) {
          return of(null)
        } else {
          return this.validateUnique(control.value);
        }
      } else {
        return this.validateUnique(control.value);
      }
    } else {
      return of(null)
    }

  }

  private validateUnique(value: string): Observable<ValidationErrors|null> {
    return this.validationFn(value).pipe(
      catchError(err => of({[this.errorKey]: true})),
      debounceTime(this.timeoutDelay)
    )
  }

}
