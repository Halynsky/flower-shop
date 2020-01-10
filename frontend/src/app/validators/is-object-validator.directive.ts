import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Directive({
  selector: '[isObjectValidator][formControlName], [isObjectValidator][ngModel], [isObjectValidator][formControl]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => IsObjectValidator),
      multi: true
    }
  ]
})

export class IsObjectValidator implements AsyncValidator {

  @Input('isObjectError') errorKey: string = 'isObject';

  constructor(private http: HttpClient) {}

   validate(control: AbstractControl): Observable<ValidationErrors|null>  {
    if (typeof control.value !== 'object' || control.value === null) {
      return of({[this.errorKey]: true});
    } else {
      return of(null);
    }
  }

}
