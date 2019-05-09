import { Component, OnInit } from '@angular/core';
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { RestPage } from "../../../api/models/RestPage";
import { FlowerType } from "../../../api/models/FlowerType";
import { SnackBarService } from "../../../services/snak-bar.service";

@Component({
  selector: 'app-flower-types',
  templateUrl: './flower-types.component.html',
  styleUrls: ['./flower-types.component.scss']
})
export class FlowerTypesComponent implements OnInit {

  cols = [
    { field: 'id', header: 'Id' },
    { field: 'name', header: 'Імя' },
    { field: 'flowersCount', header: 'Кількість Квітів' },
  ];

  flowerTypes: FlowerType[] = [];

  constructor(private flowerTypeService: FlowerTypeService,
              private snackBarService: SnackBarService) {
    this.loadData()
  }

  ngOnInit() {
  }

  loadData() {
    this.flowerTypeService.getAll().subscribe(
      flowerTypes => this.flowerTypes = flowerTypes,
      error => this.snackBarService.showError(error.error.message)
    )
  }

}
