import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from "@angular/forms";

@Directive({
  selector:'[minValue], [maxValue] '
})
export class MinMaxDirective {

  @Input() minValue: number;
  @Input() maxValue: number;

  inputElement: HTMLInputElement;

  constructor(private el: ElementRef, private ngControl : NgControl) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('input',['$event']) onEvent($event){
    let strValue = this.el.nativeElement.value;

    if (!strValue) {
      this.ngControl.control.setValue(this.minValue);
      return;
    }

    let value = parseInt(strValue);

    if (this.minValue == this.maxValue) {
      value = this.minValue;
    } else if (this.minValue && value < this.minValue) {
      value = this.minValue;
    } else if (this.maxValue && value > this.maxValue) {
      value = this.maxValue;
    }

    this.ngControl.control.setValue(value);

  }


}
