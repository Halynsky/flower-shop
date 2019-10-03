import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from "rxjs";

@Directive({
  selector: '[numberComparisonValidator][ngModel][state]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => NumberComparisonValidator),
      multi: true
    }
  ]
})

export class NumberComparisonValidator implements AsyncValidator {


  @Input('state') state: boolean;

  constructor() {
  }

  validate(control: AbstractControl): Observable<ValidationErrors|null> {
    if (this.state) {
      return this.validateMin(control);

    } else {
      return this.validateMax(control);
    }
  }

  validateMin(control): Observable<ValidationErrors|null>  {
    let max = control.root.get('max');
    if (control.value !== undefined && control.value !== null && max.value !== undefined && max.value !== null) {
      if (control.value >= max.value) {
        return  of({['invalidNumber']: true});
      } else {
        return of(null);
      }
    } else {
      return of(null);
    }

  }

  validateMax(control): Observable<ValidationErrors|null>  {
    let min = control.root.get('min');
    if (control.value !== undefined && control.value !== null && min.value !== undefined && min.value !== null) {
      if (control.value <= min.value) {
        return  of({['invalidNumber']: true});
      } else {
        return of(null);
      }
    } else {
      return of(null);
    }
  }

}
