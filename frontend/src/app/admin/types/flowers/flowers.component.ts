import { Component, OnInit } from '@angular/core';
import { FlowerTypeService } from "../../../api/services/flower-type.service";
import { SnackBarService } from "../../../services/snak-bar.service";
import { LabelValueTuple } from "../../../models/LabelValueTuple";
import { Flower } from "../../../api/models/Flower";
import { FlowerService } from "../../../api/services/flower.service";

@Component({
  selector: 'flowers',
  templateUrl: './flowers.component.html',
  styleUrls: ['./flowers.component.scss']
})
export class FlowersComponent implements OnInit {

  cols = [
    {field: 'id', header: 'Id'},
    {field: 'name', header: 'Назва'},
    {field: 'nameOriginal', header: 'Назва(англ)'},
    {field: 'flowerType', header: 'Тип квітки'}
  ];

  items: Flower[] = [];

  constructor(private dataService: FlowerService,
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

  mapForFilter = item => {
    return {
      label: item.name,
      value: item.id
    };
  };

  filter(value, filed) {
    console.log(value, filed)
  }

}


