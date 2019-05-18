import { Component, OnInit } from '@angular/core';
import { SnackBarService } from "../../../services/snak-bar.service";
import { SizeService } from "../../../api/services/size.service";
import { Size, SizeAdmin } from "../../../api/models/Size";

@Component({
  selector: 'sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent implements OnInit {

  cols = [
    { field: 'id', header: 'Id' },
    { field: 'name', header: 'Імя' },
    { field: 'flowersCount', header: 'Кількість квітів' },
  ];

  items: SizeAdmin[] = [];

  constructor(private dataService: SizeService,
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

}
