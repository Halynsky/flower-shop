import { Component, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from "@angular/forms";

@Component({
  selector: 'app-amount-controlled-input',
  templateUrl: './amount-controlled-input.component.html',
  styleUrls: ['./amount-controlled-input.component.scss']
})
export class AmountControlledInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  MAX_AMOUNT = 999;

  private _value: number = 0;
  get value(): number { return this._value; };
  set value(v: number) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  minusAmount() {
    if (this.value > 0) {
      this.value--
    }
  }

  plusAmount() {
    if (this.value < this.MAX_AMOUNT) {
      this.value
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
