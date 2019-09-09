export class Pagination {
  page: any;
  size: any;
  sort?: any;

  constructor(page: any = 0, size: any = 10, sort: any = '') {
    this.page = page;
    this.size = size;
    this.sort = sort;
  }

  fromPrimeNg(primeEvent): Pagination {
    this.page = primeEvent.first / primeEvent.rows;
    this.size = primeEvent.rows;
    const sortOrder = primeEvent.sortOrder > 0 ? 'ASC' : 'DESC';
    if (primeEvent.sortField) {
      this.sort = `${primeEvent.sortField},${sortOrder}`;
    }
    return this;
  }

  nextPage(): Pagination {
    this.page += 1;
    return this;
  }

}
