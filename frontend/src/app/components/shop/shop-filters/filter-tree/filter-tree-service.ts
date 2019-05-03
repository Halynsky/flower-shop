import { EventEmitter, Injectable } from "@angular/core";

@Injectable()
export class FilterTreeService {

  childrenArrayName = 'children';
  filters = {};

  onFilterClear: EventEmitter<any> = new EventEmitter();
  onFilterChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  clearFilters() {
    for (let key in this.filters) {
      this.filters[key] = [];
    }
    this.onFilterClear.emit();
  }
  
  toggleFilter(nodeId: number, checked: boolean, level: number) {
    console.log(checked);
    if (!this.filters[level])
      this.filters[level] = [];
    if (checked) {
      this.filters[level].push(nodeId)
    } else {
      let index = this.filters[level].indexOf(nodeId);
      if (index !== -1) this.filters[level].splice(index, 1);
    }
    this.onFilterChange.emit(this.filters)
  }

  hasFilters() {
    for (let key in this.filters) {
     if ( this.filters[key].length > 0) return true
    }
    return false
  }

  hasChildrenFn: Function = node => {
    return node[this.childrenArrayName] && node.node[this.childrenArrayName].length > 0
  };

  showCheckbox: Function = (node, level) => {
    return level == 1
  };

}
