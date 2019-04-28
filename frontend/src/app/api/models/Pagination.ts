export class Pagination {
  page: any;
  size: any;
  sort?: any;

  constructor(page: any = 0, size: any = 10, sort: any = '') {
    this.page = page;
    this.size = size;
    this.sort = sort;
  }

  nextPage(): Pagination {
    this.page += 1;
    return this;
  }

}
