import { Component, forwardRef, Injector, Input, OnDestroy, OnInit, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from "@angular/forms";

export const AMOUNT_CONTROLLED_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AmountControlledInputComponent),
  multi: true
};

@Component({
  selector: 'amount-controlled-input',
  templateUrl: './amount-controlled-input.component.html',
  styleUrls: ['./amount-controlled-input.component.scss'],
  providers: [AMOUNT_CONTROLLED_VALUE_ACCESSOR]
})
export class AmountControlledInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Input()
  minAmount = 0;
  @Input()
  maxAmount = 999;
  @Input()
  availableAmount = 999;
  @Input()
  disabled: boolean = false;

  private ngControl: NgControl;

  private _value: number = 0;
  get value(): number { return this._value; };
  set value(v: number) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  constructor(private injector: Injector) { }

  ngOnInit() {
    this.ngControl = this.injector.get(NgControl);

    this.ngControl.valueChanges.subscribe(value => {

    })

  }

  ngOnDestroy(): void {
  }

  minusAmount() {
    if (this.value > this.minAmount) {
      this.value--;
    }
  }

  plusAmount() {
    if (this.value < this.maxAmount && this.value < this.availableAmount) {
      this.value++;
    }
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }

  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: any) {
    this._value = value;
    this.onChange(value);
  }

  private onTouched = () => {
  };

  private onChange = (_: any) => {
  };


}
