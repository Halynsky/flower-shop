import { Component, OnInit } from '@angular/core';
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { FlowerType } from "../../../api/models/FlowerType";
import { SnackBarService } from "../../../services/snak-bar.service";
import { LabelValueTuple } from "../../../models/LabelValueTuple";

@Component({
  selector: 'flower-types',
  templateUrl: './flower-types.component.html',
  styleUrls: ['./flower-types.component.scss']
})
export class FlowerTypesComponent implements OnInit {

  cols = [
    {field: 'id', header: 'Id'},
    {field: 'name', header: 'Імя'},
    {field: 'flowersCount', header: 'Кількість Квітів'},
  ];

  items: FlowerType[] = [];

  constructor(private dataService: FlowerTypeService,
              private snackBarService: SnackBarService) {
    this.loadData()
  }

  ngOnInit() {
  }

  loadData() {
    this.dataService.getAll().subscribe(
      items => this.items = items,
      error => this.snackBarService.showError(error.error.message)
    )
  }

  mapToName = item => new LabelValueTuple(item.name, item.name);

}


