import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from "rxjs";

@Directive({
  selector: '[rangePairMin][ngModel], [rangePairMax][ngModel], [rangePairMin][formControlName], [rangePairMax][formControlName]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => RangePairValidator),
      multi: true
    }
  ]
})

export class RangePairValidator implements AsyncValidator {

  private readonly error = 'rangePair';
  @Input('rangePair') oppositeInput: string;
  @Input('rangePairMin') rangePairMin: number;
  @Input('rangePairMax') rangePairMax: number;

  constructor() {
  }

  validate(control: AbstractControl): Observable<ValidationErrors|null> {
    let min = parseInt(this.rangePairMin as any);
    let max = parseInt(this.rangePairMax as any);
    if (control.value && (min || max)) {

      if (min && max) {
        if (max > min) {
          return of(null)
        } else {
          return of({[this.error]: true})
        }
      }

      if(min) {
        if(control.value > min) {
          return of(null)
        } {
          return of({[this.error]: true});
        }
      }

      if(max) {
        let maxControl = control.root.get(this.oppositeInput ? this.oppositeInput : 'max');
        if(control.value < max) {
          maxControl.setErrors(null);
          return of(null)
        } {
          if (maxControl.value) {
            maxControl.setErrors({[this.error]: true});
          }
          return of(null)
        }
      }

    } else {
      return of(null)
    }
  }



}
