import { Component, Input, OnInit } from '@angular/core';
import { FilterTreeService } from "./filter-tree-service";

@Component({
  selector: 'filter-tree',
  templateUrl: './filter-tree.component.html',
  styleUrls: ['./filter-tree.component.scss'],
  providers: [ FilterTreeService ]
})
export class FilterTreeComponent implements OnInit {

  @Input()
  root: any[];
  @Input()
  childrenArrayName: string;
  @Input()
  childrenCountParamName: string;
  @Input()
  expandable: boolean;
  @Input()
  hasChildrenFn: Function;

  constructor(public filterTreeService: FilterTreeService) {
  }

  ngOnInit() {
    if (this.childrenCountParamName) this.filterTreeService.childrenCountParamName = this.childrenCountParamName;
    if (this.childrenArrayName) this.filterTreeService.childrenArrayName = this.childrenArrayName;
    if (this.hasChildrenFn) this.filterTreeService.hasChildrenFn = this.hasChildrenFn;
    if (this.expandable != undefined) this.filterTreeService.expandable = this.expandable;
  }

  trackByFn(index, item) {
    return item.id
  }

  clearTreeFilter() {
    this.filterTreeService.clearFilters();
  }

  hasFilters() {
    return this.filterTreeService.hasFilters();
  }

}
