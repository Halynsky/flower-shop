import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { SizeService } from "../api/services/size.service";

@Directive({
  selector: '[nameUniqueValidator][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => NameUniqueValidator),
      multi: true
    }
  ]
})

export class NameUniqueValidator implements AsyncValidator {
  private timeoutDelay: number = 500;
  private timeout: any;

  @Input() previousName;
  @Input('nameUniqueValidator') option: any;
  @Input('nameUniqueReverse') reverse: boolean;
  @Input('nameUniqueCatchError') catchError: boolean = false;

  constructor(private sizeService: SizeService) {
  }

  validate(control: AbstractControl): Promise<{ [key: string]: any }> {
    if (control.value) {
      if(this.previousName) {
        if((control.value as String).toLowerCase().trim() === this.previousName.toLowerCase().trim()) {
          return new Promise((resolve) => resolve(null));
        } else {
          return this.validateUnique(control.value);
        }
      } else {
        return this.validateUnique(control.value);
      }
    } else {
      return new Promise((resolve) => resolve(null));
    }

  }

  private validateUnique(value: string) {
    clearTimeout(this.timeout);
    return new Promise((resolve) => {
      this.timeout = setTimeout(() => {
        this.sizeService
          .isNameFree(value)
          .subscribe(
            data => {
              //response code 200 means that value is unique
              resolve(null);
            },
            err => {
              //in any other cases - value is not unique
              resolve({nameUnique: true});
            });
      }, this.timeoutDelay);
    });
  }

}
