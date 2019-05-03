import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FilterTreeService } from "../filter-tree-service";
import { MatCheckbox } from "@angular/material";

@Component({
  selector: 'filter-tree-node',
  templateUrl: './filter-tree-node.component.html',
  styleUrls: ['./filter-tree-node.component.scss']
})
export class FilterTreeNodeComponent implements OnInit {

  @Input()
  node; any;
  @Input()
  level; number;

  @ViewChild('checkbox') checkbox: MatCheckbox;

  showCheckbox: boolean = false;
  hasChildren: boolean = false;
  expanded: boolean = false;

  constructor(public filterTreeService: FilterTreeService) {
    filterTreeService.onFilterClear.subscribe(() => this.checkbox.writeValue(false))
  }

  ngOnInit() {
    this.hasChildren = this.filterTreeService.hasChildrenFn(this.node);
    this.showCheckbox = this.filterTreeService.showCheckbox(this.node, this.level);
  }

  toggleExpand(event) {
    if (this.hasChildren) this.expanded = !this.expanded;
  }

  trackByFn(index, item) {
    return item.id
  }

  onCheckboxChange(event) {

    this.filterTreeService.toggleFilter(this.node.id, event.checked, this.level);


  }

}
