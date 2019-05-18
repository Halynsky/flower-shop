import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../services/snak-bar.service";
import { Color } from "../../../api/models/Color";
import { ColorService } from "../../../api/services/color.service";
import { LabelValueTuple } from "../../../models/LabelValueTuple";

@Component({
  selector: 'colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent implements OnInit {

  cols = [
    { field: 'id', header: 'Id' },
    { field: 'name', header: 'Імя' },
    { field: 'flowersCount', header: 'Кількість квітів' },
    { field: 'hex', header: 'Hex' },
    { field: 'example', header: 'Приклад' }
  ];

  items: Color[] = [];

  constructor(private dataService: ColorService,
              private snackBarService: SnackBarService) {
    this.loadData()
  }

  ngOnInit() {
  }

  loadData() {
    this.dataService.getForAdmin().subscribe(
      items => this.items = items,
      error => this.snackBarService.showError(error.error.message)
    )
  }

  mapToName = item => new LabelValueTuple(item.name, item.name);

}
