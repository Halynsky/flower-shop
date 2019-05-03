import { Component, Input, OnInit } from '@angular/core';
import { FilterTreeService } from "./filter-tree-service";

@Component({
  selector: 'filter-tree',
  templateUrl: './filter-tree.component.html',
  styleUrls: ['./filter-tree.component.scss'],
  providers: [ FilterTreeService ]
})
export class FilterTreeComponent implements OnInit {

  TREE_FILTER_LEVEL = 1;

  @Input()
  root: any[];
  @Input()
  childrenArrayName: string;
  @Input()
  hasChildrenFn: Function;

  constructor(public filterTreeService: FilterTreeService) {
  }

  ngOnInit() {
    if (this.childrenArrayName) this.filterTreeService.childrenArrayName = this.childrenArrayName;
    if (this.hasChildrenFn) this.filterTreeService.hasChildrenFn = this.hasChildrenFn;

  }

  trackByFn(index, item) {
    return item.id
  }

  clearTreeFilter() {
    this.filterTreeService.clearFilters();
  }

}
