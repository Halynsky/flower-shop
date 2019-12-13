import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'confirmation-error',
  templateUrl: './confirmation-error.component.html',
  styleUrls: ['./confirmation-error.component.scss']
})
export class ConfirmationErrorComponent implements OnInit {

  @Input() title = 'Невідома помилка';
  @Input() error = 'Повторіть операцію через декілька хвилин';

  constructor() { }

  ngOnInit() {
  }

  // TODO: Implement activation

}
