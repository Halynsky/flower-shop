import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[numberComparisonValidator][ngModel][minimum], [numberComparisonValidator][ngModel][maximum]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => NumberComparisonValidator),
      multi: true
    }
  ]
})

export class NumberComparisonValidator implements AsyncValidator {

  @Input('minimum') min;
  @Input('maximum') max;

  constructor() {
  }

  validate(control: AbstractControl): Promise<{ [key: string]: any }> {
    if (this.max == undefined) {
      if (control.value <= this.min) {
        return new Promise((resolve) => {
          resolve({invalidNumber: true});
        });
      } else {
        return new Promise((resolve) => {
          resolve(null);
        });
      }
    } else if (this.min == undefined) {
      if (control.value >= this.max) {
        return new Promise((resolve) => {
          resolve({invalidNumber: true});
        });
      } else {
        return new Promise((resolve) => {
          resolve(null);
        });
      }
    }
  }

}
